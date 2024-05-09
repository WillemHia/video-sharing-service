import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service';
import { CreateWatchHistoryDto } from './dto/create-watch-history.dto';
import { UpdateWatchHistoryDto } from './dto/update-watch-history.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('watch-history')
export class WatchHistoryController {
  constructor(private readonly watchHistoryService: WatchHistoryService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createWatchHistoryDto: CreateWatchHistoryDto,
    @Req() req: Request,
  ) {
    const data = await this.watchHistoryService.create(
      createWatchHistoryDto,
      req['user'].id,
    );
    return { code: data ? 200 : 10000 };
  }

  @Get()
  findAll() {
    return this.watchHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.watchHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWatchHistoryDto: UpdateWatchHistoryDto,
  ) {
    return this.watchHistoryService.update(+id, updateWatchHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.watchHistoryService.remove(+id);
  }
}
