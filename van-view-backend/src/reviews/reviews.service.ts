import { Injectable } from '@nestjs/common';
import { APIResponse } from 'src/api/apiResponse';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Reviews } from './entities/review.entity';
import { ReviewsRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(private readonly reviewsRepository: ReviewsRepository) {}

  async create(
    createReviewDto: CreateReviewDto,
    userId: number,
  ): Promise<APIResponse<Reviews | null>> {
    return this.reviewsRepository.createReview(createReviewDto, userId);
  }

  async findOne(
    businessId: number,
    keyword: string,
    offset: number,
    limit: number,
  ): Promise<APIResponse<Reviews[] | null>> {
    return await this.reviewsRepository.findByBusinessId(
      businessId,
      keyword,
      offset,
      limit,
    );
  }

  async update(
    reviewId: number,
    updateReviewDto: UpdateReviewDto,
    userId: number,
  ) {
    return await this.reviewsRepository.updateReview(
      reviewId,
      updateReviewDto,
      userId,
    );
  }

  remove(reviewId: number, userId: number) {
    return this.reviewsRepository.removeReview(reviewId, userId);
  }
}
