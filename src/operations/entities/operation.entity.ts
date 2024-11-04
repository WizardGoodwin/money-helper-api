import { Category } from 'src/categories/entities/category.entity';
import { Wallet } from 'src/wallets/entities/wallet.entity';
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

  @ManyToOne(() => Wallet, (wallet) => wallet.operations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  wallet: Wallet;

  @CreateDateColumn()
  created_at: Date;
}
