import { EntityManager, EntityRepository, MikroORM, Options, ReflectMetadataProvider } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import path from 'path';
import { BaseEntity } from './entities/base.entity';
import { User } from './entities/users.entity';

const dbOptions: Options<PostgreSqlDriver> = {
  metadataProvider: ReflectMetadataProvider,
  type: 'postgresql',
  entities: [BaseEntity, User],

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
export default dbOptions;
