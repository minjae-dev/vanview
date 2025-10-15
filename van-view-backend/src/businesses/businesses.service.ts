import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Business } from './entities/business.entity';

@Injectable()
export class BusinessesService {
  @InjectRepository(Business) private businessRepository: Repository<Business>;

  create(createBusinessDto: CreateBusinessDto) {
    return this.businessRepository.save(createBusinessDto);
  }

  findBusinesses(
    limit: number,
    offset: number,
    category?: string,
    search?: string,
  ) {
    const queryBuilder = this.businessRepository.createQueryBuilder('business');

    if (category) {
      // 서브쿼리로 business_type_id 필터링 (조인 없이)
      queryBuilder.andWhere(
        `business.business_type = :category
        OR
        business.business_subtype = :category`,
        { category },
      );
    }

    if (search) {
      queryBuilder.andWhere('business.name ILIKE :search', {
        search: `%${search}%`,
      });
    }

    return queryBuilder.take(limit).skip(offset).getMany();
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
