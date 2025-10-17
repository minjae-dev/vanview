import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessDto } from './dto/business.dto';
import { Business } from './entities/business.entity';
import { BusinessRepository } from './repositories/business.repository';

@Injectable()
export class BusinessesService {
  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
    private customBusinessRepository: BusinessRepository,
  ) {}

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
}
