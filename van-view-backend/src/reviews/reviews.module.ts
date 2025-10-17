import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Reviews } from './review.entity';
import { ReviewsController } from './reviews.controller';
import { ReviewsRepository } from './reviews.repository';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reviews])],
  controllers: [ReviewsController],
  providers: [
    ReviewsService,
    {
      provide: ReviewsRepository,
      useFactory: (dataSource: DataSource) => {
        return new ReviewsRepository(dataSource);
      },
      inject: [DataSource],
    },
  ],
})
export class ReviewsModule {}
