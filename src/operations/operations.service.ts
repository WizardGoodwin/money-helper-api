import { Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Operation } from './entities/operation.entity';
import { EntityManager, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private readonly operationsRepository: Repository<Operation>,
    private readonly categoriesService: CategoriesService,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createOperationDto: CreateOperationDto) {
    const category = await this.categoriesService.findOne(
      createOperationDto.categoryId,
    );
    if (!category) {
      return 'Category not found';
    }
    const operation = new Operation();
    operation.amount = createOperationDto.amount;
    operation.category = category;

    const newOperation = await this.entityManager.save(operation);

    delete newOperation.category.operations;

    return {
      message: 'Operation created successfully',
      operation: { ...newOperation, categoryId: category.id },
    };
  }

  async findAll() {
    return this.operationsRepository.find({ relations: ['category'] });
  }

  async findOne(id: number) {
    return this.operationsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async update(id: number, updateOperationDto: UpdateOperationDto) {
    const operation = await this.operationsRepository.findOneBy({ id });
    if (!operation) {
      return 'Operation not found';
    }
    const category = await this.categoriesService.findOne(
      updateOperationDto.categoryId,
    );
    operation.amount = updateOperationDto.amount;
    operation.category = category;
    const updatedOperation = await this.operationsRepository.save(operation);

    return {
      message: 'Operation updated successfully',
      operation: updatedOperation,
    };
  }

  async remove(id: number) {
    const operation = await this.operationsRepository.findOneBy({ id });
    if (!operation) {
      return 'Operation not found';
    }

    await this.operationsRepository.delete(id);

    return 'Operation deleted successfully';
  }
}
