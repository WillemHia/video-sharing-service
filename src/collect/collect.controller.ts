import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CollectService } from './collect.service';
import { UpdateCollectDto } from './dto/update-collect.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('collect')
export class CollectController {
  constructor(private readonly collectService: CollectService) {}

  @UseGuards(AuthGuard)
  @Post()
  async userCollect(
    @Body() updateCollectDto: UpdateCollectDto,
    @Req() req: Request,
  ) {
    const data = await this.collectService.userCollect(
      req['user'].id,
      updateCollectDto.videoId,
    );
    return { code: data ? 200 : 10000 };
  }

  @UseGuards(AuthGuard)
  @Put()
  async userUnCollect(
    @Body() updateCollectDto: UpdateCollectDto,
    @Req() req: Request,
  ) {
    const data = await this.collectService.userUnCollect(
      req['user'].id,
      updateCollectDto.videoId,
    );
    return { code: data ? 200 : 10000 };
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  findCountByUserId(@Param('userId') userId: string, @Req() req: Request) {
    if (Number(userId) === 0) {
      return this.collectService.findCountByUserId(req['user'].id);
    } else {
      return this.collectService.findCountByUserId(Number(userId));
    }
  }

  @Get('video/:videoId')
  findCountByVideoId(@Param('videoId') videoId: string) {
    return this.collectService.findCountByVideoId(+videoId);
  }

  @Get(':userId/:videoId')
  findOneByUserIdAndVideoId(
    @Param('userId') userId: string,
    @Param('videoId') videoId: string,
  ) {
    return this.collectService.findOneByUserIdAndVideoId(+userId, +videoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCollectDto: UpdateCollectDto) {
    return this.collectService.update(+id, updateCollectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.collectService.remove(+id);
  }
}
