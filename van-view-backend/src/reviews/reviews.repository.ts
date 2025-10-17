import { Injectable } from '@nestjs/common';
import createApiResponse, { APIResponse } from 'src/api/apiResponse';
import { DataSource, Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Reviews } from './review.entity';
@Injectable()
export class ReviewsRepository extends Repository<Reviews> {
  constructor(private dataSource: DataSource) {
    super(Reviews, dataSource.createEntityManager());
  }

  async createReview(
    createReviewDto: CreateReviewDto,
    userId: number,
  ): Promise<APIResponse<Reviews | null>> {
    const { businessId, reviewType, interviewReview, workReview, tags } =
      createReviewDto;
    try {
      if (!userId || !businessId) {
        return createApiResponse(
          null,
          'User ID and Business ID are required',
          404,
        );
      }

      const existedReview = await this.findBy({
        user: userId ? { id: userId } : null,
        business: businessId ? { id: businessId } : null,
        isDeleted: false,
      });

      if (existedReview) {
        return createApiResponse(null, 'Review already exists', 400);
      }

      const review = this.create({
        type: reviewType,
        interviewReview,
        workReview,
        user: { id: userId },
        business: { id: businessId },
        tags,
      });
      if (!review) {
        return createApiResponse(null, 'Failed to create review entity', 500);
      } else {
        await this.save(review);
        return createApiResponse(review, 'Review created successfully', 201);
      }
    } catch (error) {
      console.error('Error creating review:', error);
      return createApiResponse(null, 'Failed to create review', 500);
    }
  }

  async findByBusinessId(
    businessId: number,
    search: string,
    offset: number,
    limit: number,
  ): Promise<APIResponse<Reviews[] | null>> {
    let businessReviews: Reviews[];
    try {
      let query = await this.createQueryBuilder('reviews');

      if (search) {
        query = query.andWhere(
          'reviews.interviewReview LIKE :search OR reviews.workReview LIKE :search',
          {
            search: `%${search}%`,
          },
        );
      }

      businessReviews = await query
        .select(['reviews', 'user.id', 'user.email'])
        .leftJoin('reviews.user', 'user')
        .where('reviews.business_id = :businessId', { businessId })
        .andWhere('reviews.isDeleted = :isDeleted', { isDeleted: false })
        .orderBy('reviews.created_at', 'DESC')
        .offset(offset || 0)
        .limit(limit || 10)
        .getMany();

      if (!businessReviews)
        return createApiResponse(null, 'No reviews found', 404);
    } catch (error) {
      console.error('Error fetching reviews by business ID:', error);
      return createApiResponse(businessReviews, 'Failed to fetch reviews', 200);
    }

    return createApiResponse(
      businessReviews,
      'Reviews successfully fetched',
      200,
    );
  }

  async updateReview(
    reviewId: number,
    updateReviewDto: UpdateReviewDto,
    userId: number,
  ): Promise<APIResponse<Reviews | null>> {
    try {
      const review = await this.createQueryBuilder('reviews')
        .where('reviews.id = :reviewId', { reviewId })
        .andWhere('reviews.user_id = :userId', { userId })
        .andWhere('reviews.isDeleted = false')
        .getOne();

      if (!review) {
        return createApiResponse(null, 'Review not found', 404);
      }
      Object.assign(review, updateReviewDto);
      await this.save(review);
      return createApiResponse(review, 'Review updated successfully', 200);
    } catch (error) {
      console.error('Error updating review:', error);
      return createApiResponse(null, 'Failed to update review', 500);
    }
  }

  async removeReview(reviewId: number, userId: number) {
    try {
      const review = await this.findOne({
        where: {
          user: { id: userId },
          id: reviewId,
          isDeleted: false,
        },
      });
      if (!review) {
        return createApiResponse(null, 'Review not found', 404);
      }
      review.isDeleted = true;
      await this.save(review);
      return createApiResponse(null, 'Review deleted successfully', 200);
    } catch (error) {
      console.error('Error deleting review:', error);
      return createApiResponse(null, 'Failed to delete review', 500);
    }
  }
}
