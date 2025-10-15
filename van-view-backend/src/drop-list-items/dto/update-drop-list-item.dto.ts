import { PartialType } from '@nestjs/swagger';
import { CreateDropListItemDto } from './create-drop-list-item.dto';

export class UpdateDropListItemDto extends PartialType(CreateDropListItemDto) {}
