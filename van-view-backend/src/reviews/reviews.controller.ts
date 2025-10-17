import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { APIResponse } from 'src/api/apiResponse';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Reviews } from './review.entity';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiCookieAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Create a review' })
  @ApiResponse({
    status: 201,
    description: 'The review has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({ type: CreateReviewDto, description: 'Review data' })
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @Req() req,
  ): Promise<APIResponse<Reviews | null>> {
    const userId = req.user.id;
    return this.reviewsService.create(createReviewDto, userId);
  }

  @Get(':businessId')
  @ApiOperation({ summary: 'Get reviews by business ID' })
  @ApiResponse({
    status: 200,
    description: 'The reviews have been successfully fetched.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'businessId', type: Number })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'Search keyword',
  })
  @ApiQuery({
    name: 'offset',
    type: Number,
    description: 'Pagination offset',
    default: 0,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    description: 'Pagination limit',
    default: 10,
  })
  async findOne(
    @Param('businessId') businessId: string,
    @Query('keyword') keyword: string,
    @Query('offset') offset: number,
    @Query('limit') limit: number,
  ) {
    return await this.reviewsService.findOne(
      +businessId,
      keyword,
      offset,
      limit,
    );
  }

  @Put(':reviewId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiCookieAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a review by ID' })
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'reviewId', type: Number })
  @ApiBody({ type: UpdateReviewDto, description: 'Review data' })
  async update(
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return await this.reviewsService.update(+reviewId, updateReviewDto, userId);
  }

  @Delete(':reviewId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiCookieAuth('jwt')
  @ApiOperation({ summary: 'Delete a review by ID' })
  @ApiResponse({
    status: 200,
    description: 'The review has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'reviewId', type: Number })
  remove(@Param('reviewId') reviewId: string, @Req() req) {
    const userId = req.user.id;
    return this.reviewsService.remove(+reviewId, userId);
  }
}
