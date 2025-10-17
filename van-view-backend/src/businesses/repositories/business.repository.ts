import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { BusinessDto } from '../dto/business.dto';
import { Business } from '../entities/business.entity';

@Injectable()
export class BusinessRepository extends Repository<Business> {
  constructor(private dataSource: DataSource) {
    super(Business, dataSource.createEntityManager());
  }

  async findByCategory(
    limit: number,
    offset: number,
    search?: string,
    category?: string,
  ): Promise<BusinessDto[]> {
    const queryBuilder = this.createQueryBuilder('business');

    if (category) {
      queryBuilder.andWhere(
        `business.business_type = :category OR
            business.business_subtype = :category`,
        { category },
      );
    }

    if (search) {
      queryBuilder.andWhere(
        `business.business_name ILIKE :search OR 
         business.business_trade_name ILIKE :search OR
         business.local_area ILIKE :search OR
         business.street ILIKE :search OR
         business.city ILIKE :search OR
         business.province ILIKE :search OR
         business.postal_code ILIKE :search OR
         business.country ILIKE :search OR
         business.business_type ILIKE :search OR
         business.business_subtype ILIKE :search`,
        {
          search: `%${search}%`,
        },
      );
    }
    const businesses = await queryBuilder.take(limit).skip(offset).getMany();
    const businessDto: BusinessDto[] = businesses.map((business: Business) => ({
      id: business.id.toString(),
      name: business.business_name,
      category: business.business_type ?? business.business_subtype,
      address: {
        unit: business.unit,
        house: business.house,
        street: business.street,
        city: business.city,
        province: business.province,
        postal_code: business.postal_code,
        country: business.country,
        local_area: business.local_area,
      },
      geo: {
        lat: business.latitude,
        lng: business.longitude,
      },
      headcount_range: business.head_count,
      status:
        business.status?.toLowerCase() === 'issued' ? 'active' : 'inactive',
      created_at: business.created_at?.toISOString(),
      updated_at: business.updated_at?.toISOString(),
    }));
    return businessDto;
  }
}
