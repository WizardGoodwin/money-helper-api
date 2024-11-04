import { Module } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { OperationsController } from './operations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operation } from './entities/operation.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operation, Category])],
  controllers: [OperationsController],
  providers: [OperationsService, CategoriesService],
})
export class OperationsModule {}
