import { AbstractEntity } from 'src/database/abstract.entity';
import { CategoryType } from '../types';
import { Column, Entity } from 'typeorm';

@Entity()
export class Category extends AbstractEntity<Category> {
  @Column()
  name: string;

  @Column()
  type: CategoryType;
}
