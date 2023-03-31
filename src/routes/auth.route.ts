import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';
import AuthController from '@controllers/auth.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import passport from 'passport';
import authorizeApiUsingLocal from '@/auth/authorizeApiUsingLocal';

class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public authController = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/signup`, this.authController.signUp);

    this.router.post(`${this.path}/login`, validationMiddleware(CreateUserDto, 'body'), authorizeApiUsingLocal);
  }
}

export default AuthRoute;
