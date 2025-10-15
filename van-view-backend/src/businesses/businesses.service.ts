import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessDto } from './dto/business.dto';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';
import { BusinessRepository } from './repositories/business.repository';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    private customBusinessRepository: BusinessRepository,
  ) {}

  create(createBusinessDto: CreateBusinessDto) {
    return this.businessRepository.save(createBusinessDto);
  }

  async findBusinesses(
    limit: number,
    offset: number,
    category?: string,
    search?: string,
  ): Promise<BusinessDto[]> {
    return this.customBusinessRepository.findByCategory(
      limit,
      offset,
      search,
      category,
    );
  }

  findOne(id: number) {
    return this.businessRepository.findOne({ where: { id } });
  }

  update(id: number, updateBusinessDto: UpdateBusinessDto) {
    return this.businessRepository.update(id, updateBusinessDto);
  }

  remove(id: number) {
    return this.businessRepository.delete(id);
  }
}
