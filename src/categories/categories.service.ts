import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { FindCategoriesDto } from './dto/find-categories.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = new Category(createCategoryDto);
    category.payments = [];
    const newCategory = await this.entityManager.save(category);

    return { message: 'Payment created successfully', category: newCategory };
  }

  async find(findCategoriesDto: FindCategoriesDto) {
    const { type } = findCategoriesDto;

    const conditions:
      | FindOptionsWhere<Category>
      | FindOptionsWhere<Category>[] = { ...(type ? { type } : {}) };

    return this.categoriesRepository.find({ where: conditions });
  }

  async findOne(id: number) {
    return this.categoriesRepository.findOne({
      where: { id },
      relations: ['payments'],
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      return 'Category not found';
    }
    category.name = updateCategoryDto.name;
    category.type = updateCategoryDto.type;

    const updatedCategory = await this.categoriesRepository.save(category);

    return {
      message: 'Category updated successfully',
      category: updatedCategory,
    };
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      return 'Category not found';
    }

    await this.categoriesRepository.delete(id);

    return 'Category deleted successfully';
  }
}
