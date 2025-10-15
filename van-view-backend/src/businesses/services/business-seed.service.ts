import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessCategory, BusinessSubcategory } from 'src/enums/enums';
import { Repository } from 'typeorm';
import { Business } from '../entities/business.entity';

interface VancouverBusinessData {
  folderyear: string;
  licencersn: string;
  licencenumber: string;
  licencerevisionnumber: string;
  businessname: string;
  businesstradename: string | null;
  status: string;
  issueddate: string | null;
  expireddate: string | null;
  businesstype: string;
  businesssubtype: string | null;
  unit: string | null;
  unittype: string | null;
  house: string | null;
  street: string | null;
  city: string;
  province: string;
  country: string;
  postalcode: string | null;
  localarea: string;
  numberofemployees: number;
  feepaid: string | null;
  extractdate: string;
  geom: any;
  geo_point_2d: {
    lon: number;
    lat: number;
  } | null;
}

@Injectable()
export class BusinessSeedService {
  private readonly logger = new Logger(BusinessSeedService.name);

  constructor(
    @InjectRepository(Business)
    private businessRepository: Repository<Business>,
  ) {}

  /**
   * 직원 수에 따른 headcount 범위 계산
   */
  private getHeadCount(numberOfEmployees: number): string | null {
    if (numberOfEmployees === 0) return null;
    if (numberOfEmployees <= 5) return '1-5';
    if (numberOfEmployees <= 20) return '6-20';
    if (numberOfEmployees <= 50) return '21-50';
    return '50+';
  }

  /**
   * Vancouver Open Data를 Business 엔티티로 변환
   */
  private transformVancouverData(
    data: VancouverBusinessData,
  ): Partial<Business> {
    const displayName = data.businesstradename || data.businessname;

    const address = {
      localArea: data.localarea,
      house: data.house,
      street: data.street,
      city: data.city,
      province: data.province,
      postalCode: data.postalcode,
      country: data.country,
      unit: data.unit,
      unitType: data.unittype,
    };

    const geometry = data.geo_point_2d
      ? {
          lon: data.geo_point_2d.lon,
          lat: data.geo_point_2d.lat,
        }
      : null;

    return {
      name: displayName,
      address,
      geometry,
      headCount: this.getHeadCount(data.numberofemployees) as any,
      numberOfEmployees: data.numberofemployees,
      licenceRsn: data.licencersn,
      licenceNumber: data.licencenumber,
      licenceRevisionNumber: data.licencerevisionnumber,
      businessName: data.businessname,
      businessTradeName: data.businesstradename,
      status: data.status,
      issuedDate: data.issueddate ? new Date(data.issueddate) : null,
      expiredDate: data.expireddate ? new Date(data.expireddate) : null,
      businessType: data.businesstype,
      businessSubtype: data.businesssubtype,
      unit: data.unit,
      unitType: data.unittype,
      house: data.house,
      street: data.street,
      city: data.city,
      province: data.province,
      country: data.country,
      postalCode: data.postalcode,
      localArea: data.localarea,
      numberOFEmployeesFromData: data.numberofemployees,
      feePaid: data.feepaid,
      extractDate: new Date(data.extractdate),
      folderYear: data.folderyear,
      latitude: data.geo_point_2d?.lat || null,
      longitude: data.geo_point_2d?.lon || null,
    };
  }

  /**
   * 단일 비즈니스 데이터 삽입
   */
  async insertBusiness(data: VancouverBusinessData): Promise<Business> {
    try {
      const businessData = this.transformVancouverData(data);
      const business = this.businessRepository.create(businessData);
      return await this.businessRepository.save(business);
    } catch (error) {
      this.logger.error(`Failed to insert business ${data.licencersn}:`, error);
      throw error;
    }
  }

  /**
   * 대량 비즈니스 데이터 삽입 (배치 처리)
   */
  async insertBusinessesBatch(
    dataArray: VancouverBusinessData[],
    batchSize = 100,
  ): Promise<void> {
    this.logger.log(`Starting batch insert of ${dataArray.length} businesses`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < dataArray.length; i += batchSize) {
      const batch = dataArray.slice(i, i + batchSize);

      try {
        const businessEntities = batch.map((data) => {
          const businessData = this.transformVancouverData(data);
          return this.businessRepository.create(businessData);
        });

        await this.businessRepository.save(businessEntities);
        successCount += batch.length;

        this.logger.log(
          `Batch ${Math.floor(i / batchSize) + 1}: Inserted ${
            batch.length
          } businesses`,
        );
      } catch (error) {
        this.logger.error(
          `Batch ${Math.floor(i / batchSize) + 1} failed:`,
          error,
        );
        errorCount += batch.length;

        // 개별 처리로 재시도
        for (const data of batch) {
          try {
            await this.insertBusiness(data);
            successCount++;
          } catch (individualError) {
            this.logger.error(
              `Failed to insert business ${data.licencersn}:`,
              individualError,
            );
            errorCount++;
          }
        }
      }
    }

    this.logger.log(
      `Batch insert completed: ${successCount} success, ${errorCount} errors`,
    );
  }

  /**
   * CSV/JSON 파일에서 데이터 로드 및 삽입
   */
  async seedFromVancouverData(data: VancouverBusinessData[]): Promise<void> {
    this.logger.log('Starting Vancouver business data seeding...');

    // 기존 데이터 확인
    const existingCount = await this.businessRepository.count();
    this.logger.log(`Current business count: ${existingCount}`);

    if (existingCount > 0) {
      this.logger.warn(
        'Database already contains business data. Skipping seed.',
      );
      return;
    }

    await this.insertBusinessesBatch(data);

    const newCount = await this.businessRepository.count();
    this.logger.log(`Seeding completed. Total businesses: ${newCount}`);
  }

  /**
   * 모든 비즈니스 데이터 삭제
   */
  async clearAllBusinesses(): Promise<void> {
    this.logger.log('Clearing all business data...');
    await this.businessRepository.clear();
    this.logger.log('All business data cleared.');
  }

  /**
   * 데이터베이스 통계 조회
   */
  async getBusinessStats(): Promise<any> {
    const stats = await this.businessRepository
      .createQueryBuilder('business')
      .select([
        'COUNT(*) as total',
        "COUNT(CASE WHEN status = 'Issued' THEN 1 END) as active",
        'COUNT(CASE WHEN latitude IS NOT NULL THEN 1 END) as with_location',
        'AVG(number_of_employees) as avg_employees',
        'business_type',
        'COUNT(*) as type_count',
      ])
      .groupBy('business_type')
      .getRawMany();

    return stats;
  }

  /**
   * 위치정보가 없는 비즈니스들을 필터링해서 삭제
   */
  async removeBusinessesWithoutLocation(): Promise<void> {
    this.logger.log('Starting removal of businesses without location data...');

    // 위치정보가 없는 레코드들 카운트 (latitude, longitude가 모두 null인 경우)
    const countToDelete = await this.businessRepository
      .createQueryBuilder('business')
      .where('business.latitude IS NULL OR business.longitude IS NULL')
      .getCount();

    this.logger.log(`Found ${countToDelete} businesses without location data`);

    if (countToDelete === 0) {
      this.logger.log(
        'No businesses without location found. Nothing to remove.',
      );
      return;
    }

    // 삭제 실행
    const result = await this.businessRepository
      .createQueryBuilder()
      .delete()
      .from(Business)
      .where('latitude IS NULL OR longitude IS NULL')
      .execute();

    this.logger.log(
      `Successfully deleted ${result.affected} businesses without location data`,
    );

    // 삭제 후 통계
    const remainingCount = await this.businessRepository.count();
    this.logger.log(`Remaining businesses in database: ${remainingCount}`);
  }

  /**
   * enum에 정의된 카테고리/서브카테고리 또는 이름에 cafe/restaurant이 포함된 비즈니스만 유지
   */
  async filterByEnumAndKeywords(): Promise<void> {
    this.logger.log('Starting enum and keyword-based filtering...');

    // 허용된 business type과 subtype 목록 생성 (string 값들)
    const allowedBusinessTypes = new Set<string>([
      ...Object.values(BusinessCategory),
      ...Object.values(BusinessSubcategory),
    ]);

    // 카페/레스토랑 키워드
    const keywords = [
      'cafe',
      'café',
      'restaurant',
      'coffee',
      'espresso',
      'tea',
    ];

    // 현재 데이터베이스의 모든 비즈니스 조회
    const allBusinesses = await this.businessRepository.find();
    this.logger.log(
      `Total businesses before filtering: ${allBusinesses.length}`,
    );

    // 필터링 로직
    const businessesToKeep = allBusinesses.filter((business) => {
      // 1. business_type이 허용된 enum 값에 속하는가?
      const isAllowedBusinessType = allowedBusinessTypes.has(
        business.businessType,
      );

      // 2. business_subtype이 허용된 enum 값에 속하는가?
      const isAllowedBusinessSubtype =
        business.businessSubtype &&
        allowedBusinessTypes.has(business.businessSubtype);

      // 3. business_name 또는 business_trade_name에 키워드가 포함되어 있는가?
      const businessName = (business.businessName || '').toLowerCase();
      const tradeName = (business.businessTradeName || '').toLowerCase();
      const nameContainsKeywords = keywords.some(
        (keyword) =>
          businessName.includes(keyword) || tradeName.includes(keyword),
      );

      return (
        isAllowedBusinessType ||
        isAllowedBusinessSubtype ||
        nameContainsKeywords
      );
    });

    this.logger.log(`Businesses to keep: ${businessesToKeep.length}`);
    this.logger.log(
      `Businesses to remove: ${allBusinesses.length - businessesToKeep.length}`,
    );

    if (businessesToKeep.length === allBusinesses.length) {
      this.logger.log('No businesses need to be removed. All match criteria.');
      return;
    }

    // 유지할 비즈니스의 ID 목록
    const businessIdsToKeep = businessesToKeep.map((b) => b.id);

    // 나머지 비즈니스들을 삭제
    if (businessIdsToKeep.length > 0) {
      const result = await this.businessRepository
        .createQueryBuilder()
        .delete()
        .from(Business)
        .where('id NOT IN (:...ids)', { ids: businessIdsToKeep })
        .execute();

      this.logger.log(`Successfully deleted ${result.affected} businesses`);
    } else {
      // 모든 비즈니스를 삭제해야 하는 경우
      await this.businessRepository.clear();
      this.logger.log('Deleted all businesses (none matched criteria)');
    }

    // 삭제 후 통계
    const remainingCount = await this.businessRepository.count();
    this.logger.log(`Remaining businesses in database: ${remainingCount}`);

    // 남은 비즈니스들의 타입별 분포 확인
    if (remainingCount > 0) {
      const typeStats = await this.businessRepository
        .createQueryBuilder('business')
        .select(['business.business_type', 'COUNT(*) as count'])
        .groupBy('business.business_type')
        .orderBy('count', 'DESC')
        .getRawMany();

      this.logger.log('Remaining business types:');
      typeStats.slice(0, 10).forEach((stat) => {
        this.logger.log(`  ${stat.business_business_type}: ${stat.count}`);
      });
    }
  }

  /**
   * 허용되지 않는 business type을 가진 레코드들을 삭제
   */
  async removeUnallowedBusinessTypes(): Promise<void> {
    this.logger.log(
      'Starting removal of businesses with unallowed business types...',
    );

    // 허용된 business type들 목록 생성
    const allowedBusinessTypes = new Set([
      ...Object.values(BusinessCategory),
      ...Object.values(BusinessSubcategory),
    ]);

    this.logger.log(
      `Allowed business types: ${allowedBusinessTypes.size} types`,
    );

    // 현재 데이터베이스에 있는 모든 business type들 조회
    const existingTypes = await this.businessRepository
      .createQueryBuilder('business')
      .select('DISTINCT business.business_type', 'business_type')
      .getRawMany();

    this.logger.log(
      `Found ${existingTypes.length} distinct business types in database`,
    );

    // 허용되지 않는 business type들 찾기
    const unallowedTypes = existingTypes
      .map((item) => item.business_type)
      .filter((type) => type && !allowedBusinessTypes.has(type));

    if (unallowedTypes.length === 0) {
      this.logger.log('No unallowed business types found. Nothing to remove.');
      return;
    }

    this.logger.log(`Found ${unallowedTypes.length} unallowed business types:`);
    unallowedTypes.forEach((type) => this.logger.log(`  - ${type}`));

    // 허용되지 않는 business type을 가진 레코드들 카운트
    const countToDelete = await this.businessRepository
      .createQueryBuilder('business')
      .where('business.business_type IN (:...types)', { types: unallowedTypes })
      .getCount();

    this.logger.log(
      `Will delete ${countToDelete} businesses with unallowed types`,
    );

    // 삭제 실행
    const result = await this.businessRepository
      .createQueryBuilder()
      .delete()
      .from(Business)
      .where('business_type IN (:...types)', { types: unallowedTypes })
      .execute();

    this.logger.log(
      `Successfully deleted ${result.affected} businesses with unallowed business types`,
    );

    // 삭제 후 통계
    const remainingCount = await this.businessRepository.count();
    this.logger.log(`Remaining businesses in database: ${remainingCount}`);
  }
}
