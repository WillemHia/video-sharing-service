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

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createVideoDto: CreateVideoDto) {
    console.log(createVideoDto);
    const video = await this.videoService.create(createVideoDto);
    return { code: video ? 200 : 10000 };
  }

  @UseGuards(AuthGuard)
  @Get('userId/:userId')
  async findAllByUserId(@Param('userId') userId: string, @Req() req: Request) {
    let videos: Video[] = [];
    if (Number(userId) === 0) {
      videos = await this.videoService.findAllByUserId(req['user'].id);
    } else {
      videos = await this.videoService.findAllByUserId(Number(userId));
    }
    return this.handleUrl(req, videos);
  }

  @UseGuards(AuthGuard)
  @Get('interaction/:userId')
  async findInteractionByUserId(
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {
    let videos: Video[] = [];
    if (Number(userId) === 0) {
      videos = await this.videoService.findVideoByInteraction(req['user'].id);
    } else {
      videos = await this.videoService.findVideoByInteraction(Number(userId));
    }
    return this.handleUrl(req, videos);
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
    return this.handleUrl(req, videos);
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto) {
    return this.videoService.update(+id, updateVideoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoService.remove(+id);
  }

  private handleUrl(req: Request, value: Video | Video[]) {
    const host = req.headers.host;
    const protocol = req.protocol;
    if (Array.isArray(value)) {
      return value.map((item) => {
        return {
          ...item,
          url: `${protocol}://${host}/videos/${item.url}`,
          poster: `${protocol}://${host}/images/${item.poster}`,
        };
      });
    } else {
      return {
        ...value,
        url: `${protocol}://${host}/videos/${value.url}`,
        poster: `${protocol}://${host}/images/${value.poster}`,
      };
    }
  }
}
