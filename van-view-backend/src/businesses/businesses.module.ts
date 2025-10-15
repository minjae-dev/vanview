import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessesController } from './businesses.controller';
import { BusinessesService } from './businesses.service';
import { Business } from './entities/business.entity';
import { BusinessType } from './entities/businessType.entity';
import { BusinessRepository } from './repositories/business.repository';
import { BusinessSeedService } from './services/business-seed.service';
@Module({
  imports: [TypeOrmModule.forFeature([Business, BusinessType])],
  controllers: [BusinessesController],
  providers: [BusinessesService, BusinessSeedService, BusinessRepository],
  exports: [BusinessesService, BusinessSeedService],
})
export class BusinessesModule {}
