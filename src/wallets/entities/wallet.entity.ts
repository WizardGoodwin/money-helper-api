import { AbstractEntity } from 'src/database/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Operation } from 'src/operations/entities/operation.entity';

@Entity()
export class Wallet extends AbstractEntity<Wallet> {
  @Column()
  name: string;

  @Column({ default: 0 })
  balance: number;

  @OneToMany(() => Operation, (operation) => operation.wallet, {
    cascade: true,
  })
  operations: Operation[];
}
