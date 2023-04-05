import { EntityManager, EntityRepository, MikroORM, Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import path from 'path';
import { BaseEntity } from '@entities/base.entity';
import { User } from '@entities/users.entity';

export const dbOptions: Options<PostgreSqlDriver> = {
  entities: [BaseEntity, User],

  type: 'postgresql',
  dbName: process.env.dbname|| JSON.parse(process.env.SKATCH_DB_SECRETS).dbname,
  password:  process.env.password || JSON.parse(process.env.SKATCH_DB_SECRETS).password  ,
  user: process.env.username || JSON.parse(process.env.SKATCH_DB_SECRETS).username,
  host: process.env.host || JSON.parse(process.env.SKATCH_DB_SECRETS).host,
  port: parseInt(process.env.port) || parseInt(JSON.parse(process.env.SKATCH_DB_SECRETS).port || "5432"),
  debug: process.env.APP_ENV || JSON.parse(process.env.Skatch_SECRETS).NODE_ENV === "development" ? true : false,
  migrations: {
    tableName: 'mikro_orm_migrations',
    allOrNothing: true,
    path: path.join(process.cwd(), 'dist/src/migrations'),
    pathTs: path.join(process.cwd(), 'src/migrations'),
  },
};

export const initDb = async () => {
  const orm = await MikroORM.init<PostgreSqlDriver>(dbOptions);
  if (process.env.NODE_ENV !== 'test') {
    const migrator = orm.getMigrator();

    await migrator.up();
  }
  return orm;
};

export const DI = {} as {
  orm: MikroORM;
  em: EntityManager;
  userRepository: EntityRepository<User>;
  server;
};
