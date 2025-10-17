import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DropListItemsService } from './drop-list-items.service';
import { CreateDropListItemDto } from './dto/create-drop-list-item.dto';
import {
  BulkUpdateDropListItemDto,
  UpdateDropListItemDto,
} from './dto/update-drop-list-item.dto';

@ApiTags('droplist')
@Controller('droplist')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
@ApiCookieAuth('jwt')
export class DropListItemsController {
  constructor(private readonly dropListItemsService: DropListItemsService) {}

  @Get('/my')
  @ApiOperation({ summary: 'Get my drop-list-items' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved user drop-list-items',
  })
  async findMyDropList(@Req() req) {
    const userId = req.user.id;
    return await this.dropListItemsService.findByUserId(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add new business to drop-list-items' })
  @ApiResponse({
    status: 201,
    description: 'Business successfully added to drop-list-items',
  })
  @ApiBody({ type: CreateDropListItemDto })
  async create(
    @Body() createDropListItemDto: CreateDropListItemDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return await this.dropListItemsService.create(
      createDropListItemDto,
      userId,
    );
  }

  @Patch('bulk')
  @ApiOperation({ summary: 'Bulk update dropListItems status' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated multiple items',
  })
  @ApiBody({ type: BulkUpdateDropListItemDto })
  async bulkUpdate(
    @Body() bulkUpdateDto: BulkUpdateDropListItemDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return await this.dropListItemsService.bulkUpdate(bulkUpdateDto, userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update dropListItems' })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated dropListItems',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateDropListItemDto })
  async update(
    @Param('id') id: string,
    @Body() updateDropListItemDto: UpdateDropListItemDto,
    @Req() req,
  ) {
    const userId = req.user.id;
    return await this.dropListItemsService.update(
      +id,
      updateDropListItemDto,
      userId,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete droListItem' })
  @ApiResponse({
    status: 200,
    description: 'Successfully deleted droListItem',
  })
  @ApiParam({ name: 'id', type: Number })
  remove(@Param('id') id: string, @Req() req) {
    const userId = req.user.id;
    return this.dropListItemsService.remove(+id, userId);
  }
}
