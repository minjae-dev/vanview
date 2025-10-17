import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { BusinessSubcategory } from 'src/enums/enums';
import { BusinessesService } from './businesses.service';
import { BusinessDto } from './dto/business.dto';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Get()
  @ApiQuery({ name: 'limit', required: true, type: Number })
  @ApiQuery({ name: 'offset', required: true, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
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
}
