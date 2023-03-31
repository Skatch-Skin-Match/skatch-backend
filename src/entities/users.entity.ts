import { Entity, Property, Unique, Enum } from '@mikro-orm/core';
import { BaseEntity } from '@entities/base.entity';
import { IsAlpha, IsEmail } from 'class-validator';

@Entity()
export class User extends BaseEntity {
  @Property({ nullable: true })
  firstName?: string;

  @Property({ nullable: true })
  lastName?: string;

  @Property({ nullable: true, hidden: true })
  password?: string;

  @Property({ nullable: false })
  @Unique()
  @IsEmail()
  email: string;

  @Enum(() => StartegyType)
  strategy!: string;

  @Property({ columnType: 'json', nullable: true })
  config?: any;

  @Property({ nullable: true })
  profilePicture?: string;

  constructor() {
    super();
  }
}

export enum StartegyType {
  Local = 'local',
  Google = 'google',
  Facebook = 'facebook',
}
