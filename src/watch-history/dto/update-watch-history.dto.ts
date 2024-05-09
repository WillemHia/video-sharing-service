import { PartialType } from '@nestjs/mapped-types';
import { CreateWatchHistoryDto } from './create-watch-history.dto';

export class UpdateWatchHistoryDto extends PartialType(CreateWatchHistoryDto) {}
