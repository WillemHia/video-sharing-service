import { Injectable } from '@nestjs/common';
import { CreateSearchHistoryDto } from './dto/create-search-history.dto';
import { UpdateSearchHistoryDto } from './dto/update-search-history.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchHistory } from './entities/search-history.entity';

@Injectable()
export class SearchHistoryService {
  constructor(
    @InjectRepository(SearchHistory)
    private readonly searchHistoryRepository: Repository<SearchHistory>,
  ) {}
  create(createSearchHistoryDto: CreateSearchHistoryDto) {
    const searchhistory = this.searchHistoryRepository.create(
      createSearchHistoryDto,
    );
    return this.searchHistoryRepository.save(searchhistory);
  }

  findAllByUserId(userId: number) {
    return this.searchHistoryRepository.find({
      where: { userId },
      order: { createTime: 'DESC' },
      take: 10,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} searchHistory`;
  }

  update(id: number, updateSearchHistoryDto: UpdateSearchHistoryDto) {
    return `This action updates a #${id} searchHistory`;
  }

  removeByUserId(userId: number) {
    return this.searchHistoryRepository.delete({ userId });
  }

  removeById(id: number) {
    return this.searchHistoryRepository.delete({ id });
  }
}
