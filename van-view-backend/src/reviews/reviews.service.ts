import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ApiResponse, { APIResponse } from 'src/api/apiResponse';
import { Repository } from 'typeorm/repository/Repository.js';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Reviews } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Reviews)
    private readonly reviewsRepository: Repository<Reviews>,
  ) {}

  async create(
    createReviewDto: CreateReviewDto,
    userId: number,
  ): Promise<APIResponse<Reviews | null>> {
    const { businessId, reviewType, interviewReview, workReview, tags } =
      createReviewDto;
    try {
      if (!userId || !businessId) {
        return ApiResponse(null, 'User ID and Business ID are required', 404);
      }

      const existedReview = await this.reviewsRepository.findBy({
        user: userId ? { id: userId } : null,
        business: businessId ? { id: businessId } : null,
        isDeleted: false,
      });

      if (existedReview) {
        return ApiResponse(null, 'Review already exists', 400);
      }

      const review = this.reviewsRepository.create({
        type: reviewType,
        interviewReview,
        workReview,
        user: { id: userId },
        business: { id: businessId },
        tags,
      });
      if (!review) {
        return ApiResponse(null, 'Failed to create review entity', 500);
      } else {
        await this.reviewsRepository.save(review);

        return ApiResponse(review, 'Review created successfully', 201);
      }
    } catch (error) {
      console.error('Error creating review:', error);
      return ApiResponse(null, 'Failed to create review', 500);
    }
  }

  findAll() {
    return `This action returns all reviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
