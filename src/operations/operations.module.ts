import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from './entities/operation.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
import { WalletsService } from 'src/wallets/wallets.service';
import { Wallet } from 'src/wallets/entities/wallet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operation, Category, Wallet])],
  controllers: [OperationsController],
  providers: [OperationsService, CategoriesService, WalletsService],
})
export class OperationsModule {}
