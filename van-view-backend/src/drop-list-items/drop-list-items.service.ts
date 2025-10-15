import { Injectable } from '@nestjs/common';
import { CreateDropListItemDto } from './dto/create-drop-list-item.dto';
import { UpdateDropListItemDto } from './dto/update-drop-list-item.dto';

@Injectable()
export class DropListItemsService {
  create(createDropListItemDto: CreateDropListItemDto) {
    return 'This action adds a new dropListItem';
  }

  findAll() {
    return `This action returns all dropListItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} dropListItem`;
  }

  update(id: number, updateDropListItemDto: UpdateDropListItemDto) {
    return `This action updates a #${id} dropListItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} dropListItem`;
  }
}
