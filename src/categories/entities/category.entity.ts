import { AbstractEntity } from 'src/database/abstract.entity';
import { CategoryType } from '../types';
import { Column, Entity, OneToMany } from 'typeorm';
import { Payment } from 'src/payments/entities/payment.entity';

@Entity()
export class Category extends AbstractEntity<Category> {
  @Column()
  name: string;

  @Column()
  type: CategoryType;

  @OneToMany(() => Payment, (payment) => payment.category, { cascade: true })
  payments: Payment[];
}
