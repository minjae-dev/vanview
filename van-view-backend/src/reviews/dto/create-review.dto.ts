import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateBy,
  ValidationArguments,
} from 'class-validator';
import { ReviewTag, ReviewType } from 'src/enums/enums';
import { InterviewReview, WorkReview } from '../entities/review.entity';

// Custom validation decorator for class level
export function ReviewDetailRequired() {
  return ValidateBy({
    name: 'ReviewDetailRequired',
    validator: {
      validate: (value: any, args?: ValidationArguments) => {
        const obj = args?.object as CreateReviewDto;
        if (obj.reviewType === ReviewType.INTERVIEW) {
          const hasValidInterviewReview =
            obj.interviewReview && Object.keys(obj.interviewReview).length > 0;
          return hasValidInterviewReview;
        }
        if (obj.reviewType === ReviewType.WORK) {
          const hasValidWorkReview =
            obj.workReview && Object.keys(obj.workReview).length > 0;
          return hasValidWorkReview;
        }
        return true;
      },
      defaultMessage: (args?: ValidationArguments) => {
        const obj = args?.object as CreateReviewDto;
        if (obj.reviewType === ReviewType.INTERVIEW) {
          return 'interviewReview is required for interview reviews';
        }
        if (obj.reviewType === ReviewType.WORK) {
          return 'workReview is required for work reviews';
        }
        return 'Invalid review type';
      },
    },
  });
}
export class CreateReviewDto {
  @ApiProperty({
    example: 1,
    description: '리뷰 대상 비즈니스 ID',
  })
  @IsNotEmpty()
  @IsNumber()
  businessId: number;

  @ApiProperty({
    example: 'interview',
    description: '리뷰 유형',
    enum: ReviewType,
  })
  @IsNotEmpty()
  @IsEnum(ReviewType)
  @ReviewDetailRequired()
  reviewType: ReviewType;

  @ApiProperty({
    example: {
      questionsAsked: 'What are your strengths and weaknesses?',
      atmosphere: 'Friendly and professional',
      result: 'offer',
      applicationMethod: 'Online application',
      waitTime: '2 weeks',
      interviewOutfit: 'Business casual',
    },
    description: '면접 리뷰 세부 정보',
    required: false,
  })
  @IsOptional()
  @Type(() => Object)
  interviewReview?: InterviewReview;

  @ApiProperty({
    example: {
      position: 'Software Engineer',
      salary: 70000,
      benefits: 'Health insurance, 401k',
      workEnvironment: 'Collaborative and innovative',
      growthOpportunities: 'Regular training and workshops',
    },
    description: '직장 리뷰 세부 정보',
    required: false,
  })
  @IsOptional()
  @Type(() => Object)
  workReview?: WorkReview;

  @ApiProperty({
    description: '리뷰 태그',
    isArray: true,
    enum: ReviewTag,
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  tags?: ReviewTag[];
}
