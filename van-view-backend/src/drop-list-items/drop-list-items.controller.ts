import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DropListItemsService } from './drop-list-items.service';
import { CreateDropListItemDto } from './dto/create-drop-list-item.dto';
import { UpdateDropListItemDto } from './dto/update-drop-list-item.dto';

@Controller('drop-list-items')
export class DropListItemsController {
  constructor(private readonly dropListItemsService: DropListItemsService) {}

  @Post()
  create(@Body() createDropListItemDto: CreateDropListItemDto) {
    return this.dropListItemsService.create(createDropListItemDto);
  }

  @Get()
  findAll() {
    return this.dropListItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dropListItemsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDropListItemDto: UpdateDropListItemDto,
  ) {
    return this.dropListItemsService.update(+id, updateDropListItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.dropListItemsService.remove(+id);
  }
}
