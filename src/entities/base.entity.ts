import { PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { IsNumber, IsUUID } from 'class-validator';

export abstract class BaseEntity {
  @PrimaryKey()
  @IsUUID()
  id!: string;

  @Property({ hidden: true })
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date(), hidden: true })
  updatedAt: Date = new Date();

  @Property({ nullable: false })
  deleted: boolean = false;
}
