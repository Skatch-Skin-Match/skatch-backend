import express from 'express';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { logger, stream } from '@utils/logger';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import { DI, dbOptions, initDb } from '@databases';
import { User } from '@entities/users.entity';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import passport from 'passport';
import authMiddlewareController from './auth/auth';
import path from 'path';

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public host: string;

  constructor(routes: Routes[]) {
    this.app = express();
    this.app.set('views', path.join(__dirname, 'views'));
    this.app.set('view engine', 'ejs');
    this.env = process.env.NODE_ENV || 'development';
    this.port = 3000;

    this.initializeMiddlewares();
    this.connectToDatabase();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private async connectToDatabase() {
    try {
      DI.orm = await initDb();
      DI.em = DI.orm.em.fork();
      DI.userRepository = DI.orm.em.fork().getRepository(User);

      DI.server = this.app;
    } catch (error) {
      logger.error(error);
    }
    this.app.use((_1, _2, next) => RequestContext.create(DI.orm.em, next));
  }

  private initializeMiddlewares() {
    this.app.use(morgan(process.env.LOG_FORMAT, { stream }));
    this.app.use(cors({ origin: '*', credentials: true }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(passport.initialize());
    authMiddlewareController(passport);
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
