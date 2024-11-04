import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { CategoriesModule } from './categories/categories.module';
import { OperationsModule } from './operations/operations.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    CategoriesModule,
    OperationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
