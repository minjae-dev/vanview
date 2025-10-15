import { Module } from '@nestjs/common';
import { DropListItemsService } from './drop-list-items.service';
import { DropListItemsController } from './drop-list-items.controller';

@Module({
  controllers: [DropListItemsController],
  providers: [DropListItemsService],
})
export class DropListItemsModule {}
