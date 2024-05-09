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
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { Video } from './entities/video.entity';
import { formatVideoUrl } from 'src/utils/format';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createVideoDto: CreateVideoDto) {
    const video = await this.videoService.create(createVideoDto);
    return { code: video ? 200 : 10000 };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const data = await this.videoService.findVideoDetailsById(+id);
    return { ...formatVideoUrl(data, req) };
  }

  @Get('search/:search')
  async search(@Param('search') search: string, @Req() req: Request) {
    const videos = await this.videoService.findVideoBySearch(search);
    return formatVideoUrl(videos, req);
  }

  @Get('comment/:id')
  async findCommentByVideoId(@Param('id') id: string) {
    const video = await this.videoService.findVideoCommentsById(+id);
    return video.comment;
  }

  @Get('userId/:userId')
  async findAllByUserId(@Param('userId') userId: string, @Req() req: Request) {
    const videos = await this.videoService.findAllByUserId(Number(userId));
    return formatVideoUrl(videos, req);
  }

  @UseGuards(AuthGuard)
  @Get('interaction/:userId')
  async findVideoByInteraction(
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {
    let videos: Video[] = [];
    if (Number(userId) === 0) {
      videos = await this.videoService.findVideoByInteraction(req['user'].id);
    } else {
      videos = await this.videoService.findVideoByInteraction(Number(userId));
    }
    return formatVideoUrl(videos, req);
  }

  @UseGuards(AuthGuard)
  @Get('collect/:userId')
  async findCollectByUserId(
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {
    let videos: Video[] = [];
    if (Number(userId) === 0) {
      videos = await this.videoService.findVideoByCollect(req['user'].id);
    } else {
      videos = await this.videoService.findVideoByCollect(Number(userId));
    }
    return formatVideoUrl(videos, req);
  }

  @UseGuards(AuthGuard)
  @Get('count/:userId')
  findCountByUserId(@Param('userId') userId: string, @Req() req: Request) {
    if (Number(userId) === 0) {
      return this.videoService.findCountByUserId(req['user'].id);
    } else {
      return this.videoService.findCountByUserId(Number(userId));
    }
  }

  @UseGuards(AuthGuard)
  @Get('recommend/user')
  async recommend(@Req() req: Request) {
    const videos = await this.videoService.findRecommendByUserId(
      req['user'].id,
    );
    return formatVideoUrl(videos, req);
  }

  @Get('recommend/video/:videoId')
  async recommendByVideoId(
    @Param('videoId') videoId: string,
    @Req() req: Request,
  ) {
    const videos = await this.videoService.findRecommendByVideoId(videoId);
    return formatVideoUrl(videos, req);
  }

  @Get('recommend/random')
  async recommendRandow(@Req() req: Request) {
    const videos = await this.videoService.findRandowVideo();
    return formatVideoUrl(videos, req);
  }

  @UseGuards(AuthGuard)
  @Get('recommend/random/user')
  async recommendRandowByUserId(@Req() req: Request) {
    const videos = await this.videoService.findRandowByUserId(req['user'].id);
    return formatVideoUrl(videos, req);
  }

  @Get('keyword/:keyword')
  async findVideoByKeyword(
    @Param('keyword') keyword: string,
    @Req() req: Request,
  ) {
    const videos = await this.videoService.findVideoByKeyword(keyword);
    return formatVideoUrl(videos, req);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }
}
