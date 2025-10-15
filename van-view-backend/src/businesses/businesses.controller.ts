import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { BusinessSubcategory } from 'src/enums/enums';
import { BusinessesService } from './businesses.service';
import { BusinessDto } from './dto/business.dto';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessesService.create(createBusinessDto);
  }

  @Get()
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiQuery({ name: 'offset', required: true, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  // 허용된 카테고리 목록
  // businessCategory enum 타입을 Swagger에 노출
  @ApiQuery({
    name: 'category',
    required: false,
    enum: Object.values(BusinessSubcategory),
    description: 'Business category (enum)',
  })
  @ApiQuery({ name: 'search', required: false, type: String })
  findBusinesses(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ): Promise<BusinessDto[]> {
    return this.businessesService.findBusinesses(
      limit,
      offset,
      category,
      search,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return this.businessesService.update(+id, updateBusinessDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessesService.remove(+id);
  }
}
