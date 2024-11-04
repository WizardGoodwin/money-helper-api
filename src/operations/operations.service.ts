import { Injectable } from '@nestjs/common';
import { CreateOperationDto } from './dto/create-operation.dto';
import { UpdateOperationDto } from './dto/update-operation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Operation } from './entities/operation.entity';
import { EntityManager, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { WalletsService } from 'src/wallets/wallets.service';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private readonly operationsRepository: Repository<Operation>,
    private readonly categoriesService: CategoriesService,
    private readonly walletsService: WalletsService,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createOperationDto: CreateOperationDto) {
    const category = await this.categoriesService.findOne(
      createOperationDto.categoryId,
    );
    if (!category) {
      return 'Category not found';
    }

    const wallet = await this.walletsService.findOne(
      createOperationDto.walletId,
    );
    if (!wallet) {
      return 'Wallet not found';
    }

    if (
      category.type === 'outcome' &&
      wallet.balance < createOperationDto.amount
    ) {
      return 'Not enough funds';
    }

    const operation = new Operation();
    operation.amount = createOperationDto.amount;
    operation.category = category;
    operation.wallet = wallet;

    const newOperation = await this.entityManager.save(operation);

    delete newOperation.category;
    delete newOperation.wallet;

    if (category.type === 'outcome') {
      wallet.balance -= createOperationDto.amount;
    }

    if (category.type === 'income') {
      wallet.balance += createOperationDto.amount;
    }

    this.walletsService.update(wallet.id, wallet);

    delete wallet.operations;

    return {
      message: 'Operation created successfully',
      operation: {
        ...newOperation,
        categoryId: category.id,
        walletId: wallet.id,
      },
      wallet,
    };
  }

  async findAll() {
    return this.operationsRepository.find({ relations: ['category'] });
  }

  async findOne(id: number) {
    return this.operationsRepository.findOne({
      where: { id },
      relations: ['category', 'wallet'],
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
    if (!category) {
      return 'Category not found';
    }

    const wallet = await this.walletsService.findOne(
      updateOperationDto.walletId,
    );
    if (!wallet) {
      return 'Wallet not found';
    }

    operation.amount = updateOperationDto.amount;
    operation.category = category;
    operation.wallet = wallet;
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
