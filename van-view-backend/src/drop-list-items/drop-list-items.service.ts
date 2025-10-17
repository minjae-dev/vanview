import { Injectable } from '@nestjs/common';
import { APIResponse } from 'src/api/apiResponse';
import { DropListItemState } from 'src/enums/enums';
import { DropListItemsRepository } from './drop-list-items.repository';
import { CreateDropListItemDto } from './dto/create-drop-list-item.dto';
import { UpdateDropListItemDto } from './dto/update-drop-list-item.dto';
import { DropListItems } from './entities/drop-list-item.entity';
@Injectable()
export class DropListItemsService {
  constructor(
    private readonly dropListItemsRepository: DropListItemsRepository,
  ) {}

  async findByUserId(userId: number): Promise<APIResponse<DropListItems[]>> {
    return await this.dropListItemsRepository.findByUserId(userId);
  }

  async create(
    createDropListItemDto: CreateDropListItemDto,
    userId: number,
  ): Promise<APIResponse<DropListItems>> {
    return await this.dropListItemsRepository.createDropListItem(
      createDropListItemDto,
      userId,
    );
  }

  async update(
    id: number,
    updateDropListItemDto: UpdateDropListItemDto,
    userId: number,
  ): Promise<APIResponse<DropListItems>> {
    return await this.dropListItemsRepository.updateDropListItem(
      id,
      updateDropListItemDto,
      userId,
    );
  }

  async remove(id: number, userId: number): Promise<APIResponse<null>> {
    return await this.dropListItemsRepository.removeDropListItem(id, userId);
  }

  async bulkUpdate(
    updateData: { ids: number[]; status: string[] },
    userId: number,
  ): Promise<APIResponse<DropListItems[]>> {
    // Ensure status is of type DropListItemState
    const bulkUpdateDto = {
      ids: updateData.ids,
      status: updateData.status as string[] as DropListItemState[],
    };
    return await this.dropListItemsRepository.bulkUpdate(bulkUpdateDto, userId);
  }
}
