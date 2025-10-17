import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { DropListItemMethod, DropListItemState } from 'src/enums/enums';
import { CreateDropListItemDto } from './create-drop-list-item.dto';

export class UpdateDropListItemDto extends PartialType(CreateDropListItemDto) {
  @ApiProperty({
    example: 'Interviewed',
    description: '드롭 상태 업데이트',
    enum: DropListItemState,
    required: false,
  })
  @IsOptional()
  @IsEnum(DropListItemState)
  status?: DropListItemState;

  @ApiProperty({
    example: 'phone',
    description: '지원 방법 업데이트',
    enum: DropListItemMethod,
    required: false,
  })
  @IsOptional()
  @IsEnum(DropListItemMethod)
  method?: DropListItemMethod;

  @ApiProperty({
    example: '2025-12-05',
    description: '실제 방문 날짜',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  actualDropDate?: Date;

  @ApiProperty({
    example: '면접 완료, 결과 대기중',
    description: '메모 업데이트',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}

// Bulk 업데이트용 DTO
export class BulkUpdateDropListItemDto {
  @ApiProperty({
    example: [1, 2, 3],
    description: '업데이트할 드롭리스트 항목 ID들',
    required: true,
  })
  @IsNotEmpty()
  ids: number[];

  @ApiProperty({
    example: ['Hired', 'Rejected', 'To Visit'],
    description: '변경할 상태',
    required: true,
  })
  @IsNotEmpty()
  status: string[];
}
