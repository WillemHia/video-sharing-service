import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SearchHistoryService } from './search-history.service';
import { CreateSearchHistoryDto } from './dto/create-search-history.dto';
import { UpdateSearchHistoryDto } from './dto/update-search-history.dto';

@Controller('search-history')
export class SearchHistoryController {
  constructor(private readonly searchHistoryService: SearchHistoryService) {}

  @Post()
  async create(@Body() createSearchHistoryDto: CreateSearchHistoryDto) {
    const data = await this.searchHistoryService.create(createSearchHistoryDto);
    return { code: data ? 200 : 10000 };
  }

  @Get(':userId')
  findAll(@Param('userId') userId: string) {
    return this.searchHistoryService.findAllByUserId(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.searchHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSearchHistoryDto: UpdateSearchHistoryDto,
  ) {
    return this.searchHistoryService.update(+id, updateSearchHistoryDto);
  }

  @Delete('all/:userId')
  async removeByUserId(@Param('userId') id: string) {
    const data = await this.searchHistoryService.removeByUserId(+id);
    return { code: data ? 200 : 10000 };
  }

  @Delete(':id')
  async removeById(@Param('id') id: string) {
    const data = await this.searchHistoryService.removeById(+id);
    return { code: data ? 200 : 10000 };
  }
}
