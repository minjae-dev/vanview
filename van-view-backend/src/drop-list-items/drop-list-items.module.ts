import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DropListItemsController } from './drop-list-items.controller';
import { DropListItemsRepository } from './drop-list-items.repository';
import { DropListItemsService } from './drop-list-items.service';
import { DropListItems } from './entities/drop-list-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DropListItems])],
  controllers: [DropListItemsController],
  providers: [
    DropListItemsService,
    {
      provide: DropListItemsRepository,
      useFactory: (dataSource: DataSource) => {
        return new DropListItemsRepository(dataSource);
      },
      inject: [DataSource],
    },
  ],
  exports: [DropListItemsService],
})
export class DropListItemsModule {}
