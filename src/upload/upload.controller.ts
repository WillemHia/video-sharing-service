import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { getVideoDuration, getVideoFirstFrame } from 'src/utils/videoHandle';
import { formatVideoDuration } from 'src/utils/format';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @UseGuards(AuthGuard)
  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { id: number; avatar: string },
    @Req() req: Request,
  ) {
    await this.uploadService.updateAvatar(body.id, file.filename, body.avatar);
    const host = req.headers.host;
    const protocol = req.protocol;
    return {
      avatar: `${protocol}://${host}/images/${file.filename}`,
    };
  }

  @UseGuards(AuthGuard)
  @Post('background')
  @UseInterceptors(FileInterceptor('file'))
  async uploadBackground(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { id: number; backgroundImg: string },
    @Req() req: Request,
  ) {
    await this.uploadService.updateBackground(
      body.id,
      file.filename,
      body.backgroundImg,
    );
    const host = req.headers.host;
    const protocol = req.protocol;
    return {
      backgroundImg: `${protocol}://${host}/images/${file.filename}`,
    };
  }

  @UseGuards(AuthGuard)
  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const duration = await getVideoDuration(file.path);
    const totalTime = formatVideoDuration(duration);
    const poster = await getVideoFirstFrame(file.path);
    const host = req.headers.host;
    const protocol = req.protocol;
    return {
      totalTime,
      poster: `${protocol}://${host}/images/${poster}`,
      url: `${protocol}://${host}/videos/${file.filename}`,
    };
  }

  @UseGuards(AuthGuard)
  @Post('poster')
  @UseInterceptors(FileInterceptor('file'))
  async uploadCover(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { poster: string },
    @Req() req: Request,
  ) {
    await this.uploadService.deletePoster(body.poster);
    const host = req.headers.host;
    const protocol = req.protocol;
    return {
      poster: `${protocol}://${host}/images/${file.filename}`,
    };
  }
}
