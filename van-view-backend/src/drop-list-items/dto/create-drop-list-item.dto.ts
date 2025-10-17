import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DropListItemMethod, DropListItemState } from 'src/enums/enums';

export class CreateDropListItemDto {
  @ApiProperty({
    example: 1,
    description: '추가할 비즈니스 ID',
  })
  @IsNotEmpty()
  @IsNumber()
  businessId: number;

  @ApiProperty({
    example: 'To Visit',
    description: '드롭 상태',
    enum: DropListItemState,
  })
  @IsNotEmpty()
  @IsEnum(DropListItemState)
  status: DropListItemState;

  @ApiProperty({
    example: 'in-person',
    description: '지원 방법',
    enum: DropListItemMethod,
  })
  @IsNotEmpty()
  @IsEnum(DropListItemMethod)
  method: DropListItemMethod;

  @ApiProperty({
    example: '2025-12-01',
    description: '계획된 방문 날짜',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  plannedDropDate?: Date;

  @ApiProperty({
    example: '이력서와 자기소개서 준비 완료',
    description: '메모',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
