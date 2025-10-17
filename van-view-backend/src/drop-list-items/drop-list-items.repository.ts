import { Injectable } from '@nestjs/common';
import ApiResponse, { APIResponse } from 'src/api/apiResponse';
import { DropListItemState } from 'src/enums/enums';
import { DataSource, Repository } from 'typeorm';
import { CreateDropListItemDto } from './dto/create-drop-list-item.dto';
import { DropListItems } from './entities/drop-list-item.entity';

@Injectable()
export class DropListItemsRepository extends Repository<DropListItems> {
  constructor(private dataSource: DataSource) {
    super(DropListItems, dataSource.createEntityManager());
  }
  async findByUserId(
    userId: number,
  ): Promise<APIResponse<DropListItems[] | null>> {
    try {
      if (!userId) {
        return ApiResponse(null, 'User ID is required', 404);
      }
      const dropList = await this.createQueryBuilder('dropListItem')
        .where('dropListItem.user_id = :userId', { userId })
        .getMany();

      return ApiResponse(dropList, 'DropListItems retrieved successfully', 200);
    } catch (error) {
      console.error('Error fetching DropListItems items:', error);
      return ApiResponse(null, 'Failed to fetch DropListItems', 500);
    }
  }

  async createDropListItem(
    createDropListItemDto: CreateDropListItemDto,
    userId: number,
  ): Promise<APIResponse<DropListItems | null>> {
    try {
      const { businessId, ...rest } = createDropListItemDto;

      const existingItem = await this.createQueryBuilder('dropListItem')
        .where('dropListItem.user_id = :userId', { userId })
        .andWhere('dropListItem.business_id = :businessId', { businessId })
        .getOne();

      if (existingItem) {
        return ApiResponse(
          null,
          'Business already exists in your dropList',
          400,
        );
      }

      const dropListItem = this.create({
        ...rest,
        user: { id: userId },
        business: { id: businessId },
      });

      const savedItem = await this.save(dropListItem);
      return ApiResponse(
        savedItem,
        'Business added to dropList successfully',
        201,
      );
    } catch (error) {
      console.error('Error creating dropList item:', error);
      return ApiResponse(null, 'Failed to add business to dropList', 500);
    }
  }

  async updateDropListItem(
    id: number,
    updateDropListItemDto: any,
    userId: number,
  ): Promise<APIResponse<DropListItems | null>> {
    try {
      const item = await this.findOne({
        where: { id, user: { id: userId } },
      });

      if (!item) {
        return ApiResponse(null, 'DropListItem not found', 404);
      }

      Object.assign(item, updateDropListItemDto);
      const updatedItem = await this.save(item);

      return ApiResponse(
        updatedItem,
        'Droplist item updated successfully',
        200,
      );
    } catch (error) {
      console.error('Error updating droplist item:', error);
      return ApiResponse(null, 'Failed to update droplist item', 500);
    }
  }

  async bulkUpdate(
    bulkUpdateDto: { ids: number[]; status: string[] },
    userId: number,
  ): Promise<APIResponse<DropListItems[] | null>> {
    try {
      const { ids, status } = bulkUpdateDto;

      if ((!ids || ids.length === 0) && (!status || status.length === 0)) {
        return ApiResponse(null, 'No IDs provided for bulk update', 400);
      }

      if (status.length !== ids.length) {
        return ApiResponse(
          null,
          'Status array length must match IDs array length',
          400,
        );
      }

      const items = await this.createQueryBuilder('dropListItem')
        .where('dropListItem.id IN (:...ids)', { ids })
        .andWhere('dropListItem.user_id = :userId', { userId })
        .getMany();

      if (items.length === 0) {
        return ApiResponse(null, 'No matching DropListItems found', 404);
      }

      if (items.length !== ids.length) {
        return ApiResponse(
          null,
          'Some DropListItems not found for the provided IDs',
          404,
        );
      }

      for (const item of items) {
        item.status = status[
          ids.indexOf(item.id)
        ] as unknown as DropListItemState;
      }

      const updatedItems = await this.save(items);
      return ApiResponse(updatedItems, 'Bulk update successful', 200);
    } catch (error) {
      console.error('Error performing bulk update:', error);
      return ApiResponse(null, 'Failed to perform bulk update', 500);
    }
  }

  async removeDropListItem(id: number, userId: number) {
    try {
      const item = await this.findOne({
        where: { id, user: { id: userId } },
      });
      if (!item) {
        return ApiResponse(null, 'DropListItem not found', 404);
      }

      await this.remove(item);
      return ApiResponse(null, 'Droplist item deleted successfully', 200);
    } catch (error) {
      console.error('Error deleting droplist item:', error);
      return ApiResponse(null, 'Failed to delete droplist item', 500);
    }
  }
}
