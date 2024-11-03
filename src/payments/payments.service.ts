import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { EntityManager, Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    private readonly categoriesService: CategoriesService,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const category = await this.categoriesService.findOne(
      createPaymentDto.categoryId,
    );
    if (!category) {
      return 'Category not found';
    }
    const payment = new Payment();
    payment.amount = createPaymentDto.amount;
    payment.category = category;

    const newPayment = await this.entityManager.save(payment);

    delete newPayment.category.payments;

    return {
      message: 'Payment created successfully',
      payment: { ...newPayment, categoryId: category.id },
    };
  }

  async findAll() {
    return this.paymentsRepository.find({ relations: ['category'] });
  }

  async findOne(id: number) {
    return this.paymentsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.paymentsRepository.findOneBy({ id });
    if (!payment) {
      return 'Payment not found';
    }
    const category = await this.categoriesService.findOne(
      updatePaymentDto.categoryId,
    );
    payment.amount = updatePaymentDto.amount;
    payment.category = category;
    const updatedPayment = await this.paymentsRepository.save(payment);

    return { message: 'Payment updated successfully', payment: updatedPayment };
  }

  async remove(id: number) {
    const payment = await this.paymentsRepository.findOneBy({ id });
    if (!payment) {
      return 'Payment not found';
    }

    await this.paymentsRepository.delete(id);

    return 'Payment deleted successfully';
  }
}
