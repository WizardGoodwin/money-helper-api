import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletsRepository: Repository<Wallet>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createWalletDto: CreateWalletDto) {
    const wallet = new Wallet(createWalletDto);
    wallet.operations = [];
    const newWallet = await this.entityManager.save(wallet);

    return { message: 'Wallet created successfully', wallet: newWallet };
  }

  async findAll() {
    return this.walletsRepository.find();
  }

  async findOne(id: number) {
    return this.walletsRepository.findOne({
      where: { id },
      relations: ['operations'],
    });
  }

  async update(id: number, updateWalletDto: UpdateWalletDto) {
    const wallet = await this.walletsRepository.findOneBy({ id });
    if (!wallet) {
      return 'Wallet not found';
    }
    wallet.name = updateWalletDto.name;
    if (updateWalletDto.balance) {
      wallet.balance = updateWalletDto.balance;
    }

    const updatedWallet = await this.walletsRepository.save(wallet);

    return {
      message: 'Wallet updated successfully',
      wallet: updatedWallet,
    };
  }

  async remove(id: number) {
    const wallet = await this.walletsRepository.findOneBy({ id });
    if (!wallet) {
      return 'Wallet not found';
    }

    await this.walletsRepository.delete(id);

    return 'Wallet deleted successfully';
  }
}
