import { Migration } from '@mikro-orm/migrations';

export class Migration20220418204957 extends Migration {
  async up(): Promise<void> {
    // this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "username" varchar(255) not null, "password" varchar(255) not null, "email" varchar(255) not null);');
    // this.addSql('create extension "uuid-ossp"')
    this.addSql(
      'create table "user" ("id" uuid  primary key, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "first_name" varchar(255) null,"last_name" varchar(255)  null, "password" varchar(255)  null, "email" varchar(255) not null , "strategy" text check ("strategy" in (\'local\', \'google\', \'facebook\')) null, "deleted" boolean DEFAULT false not null  );',
    );
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('alter table "user" add column "config" json;');

  }
}
