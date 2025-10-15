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
    const businesses = await queryBuilder.take(limit).skip(offset).getMany();
    const businessDto: BusinessDto[] = businesses.map((business: Business) => ({
      id: business.id.toString(),
      name: business.name,
      category: business.businessType ?? business.businessSubtype,
      address: {
        unit: business.unit,
        house: business.house,
        street: business.street,
        city: business.city,
        province: business.province,
        postal_code: business.postalCode,
        country: business.country,
        local_area: business.localArea,
      },
      geo: {
        lat: business.latitude,
        lng: business.longitude,
      },
      headcount_range: business.headCount,
      status:
        business.status?.toLowerCase() === 'issued' ? 'active' : 'inactive',
      created_at: business.createdAt?.toISOString(),
      updated_at: business.updatedAt?.toISOString(),
    }));
    return businessDto;
  }
}
