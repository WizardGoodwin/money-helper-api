import { Category } from 'src/categories/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Operation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @ManyToOne(() => Category, (category) => category.operations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  category: Category;

  @CreateDateColumn()
  created_at: Date;
}
