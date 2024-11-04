import { AbstractEntity } from 'src/database/abstract.entity';
import { CategoryType } from '../types';
import { Column, Entity, OneToMany } from 'typeorm';
import { Operation } from 'src/operations/entities/operation.entity';

@Entity()
export class Category extends AbstractEntity<Category> {
  @Column()
  name: string;

  @Column()
  type: CategoryType;

  @OneToMany(() => Operation, (operation) => operation.category, {
    cascade: true,
  })
  operations: Operation[];
}
