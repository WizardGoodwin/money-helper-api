import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category(createCategoryDto);
    await this.entityManager.save(category);

    return category;
  }

  async findAll() {
    return this.categoriesRepository.find();
  }

  async findOne(id: number) {
    return this.categoriesRepository.findOneBy({ id });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    let category = await this.categoriesRepository.findOneBy({ id });
    category = { ...category, ...updateCategoryDto };
    await this.entityManager.save(category);

    return category;
  }

  async remove(id: number) {
    await this.categoriesRepository.delete(id);
  }
}
