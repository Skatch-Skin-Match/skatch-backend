

import { Migration } from '@mikro-orm/migrations';

export class Migration20230117130545 extends Migration {
  async up(): Promise<void> {
   
    this.addSql('alter table "user" add "profile_picture" varchar(500) null;');
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
     }
}
