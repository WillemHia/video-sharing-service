import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LabelService } from './label.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('label')
export class LabelController {
  constructor(private readonly labelService: LabelService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createLabelDto: CreateLabelDto) {
    return this.labelService.create(createLabelDto);
  }

  @UseGuards(AuthGuard)
  @Get('/name/:name')
  findAllByName(@Param('name') name: string) {
    return this.labelService.findAllByName(name);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.labelService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.labelService.findOneByName(name);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLabelDto: UpdateLabelDto) {
    return this.labelService.update(+id, updateLabelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labelService.remove(+id);
  }
}
