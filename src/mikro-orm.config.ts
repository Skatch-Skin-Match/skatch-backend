import { EntityManager, EntityRepository, MikroORM, Options, ReflectMetadataProvider } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import path from 'path';
import { BaseEntity } from './entities/base.entity';
import { User } from './entities/users.entity';

const dbOptions: Options<PostgreSqlDriver> = {
  metadataProvider: ReflectMetadataProvider,
  type: 'postgresql',
  entities: [BaseEntity, User],

  dbName: process.env.SKATCH_DB_DATABASE,
  password: process.env.SKATCH_DB_PASSWORD,
  user: process.env.SKATCH_DB_USERNAME,
  host: process.env.SKATCH_DB_HOST,
  port: parseInt(process.env.SKATCH_DB_PORT || '5432'),
  debug: process.env.NODE_ENV === 'development' ? true : false,
  migrations: {
    tableName: 'mikro_orm_migrations',
    allOrNothing: true,
    path: path.join(process.cwd(), 'dist/src/migrations'),
    pathTs: path.join(process.cwd(), 'src/migrations'),
  },
};
export default dbOptions;
