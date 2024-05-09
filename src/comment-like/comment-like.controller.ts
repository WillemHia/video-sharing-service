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
} from '@nestjs/common';
import { CommentLikeService } from './comment-like.service';
import { CreateCommentLikeDto } from './dto/create-comment-like.dto';
import { UpdateCommentLikeDto } from './dto/update-comment-like.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('comment-like')
export class CommentLikeController {
  constructor(private readonly commentLikeService: CommentLikeService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createCommentLikeDto: CreateCommentLikeDto,
    @Req() req: Request,
  ) {
    const data = await this.commentLikeService.create(
      createCommentLikeDto,
      req['user'].id,
    );

    return { code: data ? 200 : 10000 };
  }

  @UseGuards(AuthGuard)
  @Get('user/video/:videoId')
  findAllByUserIdAndVideoId(
    @Param('videoId') videoId: string,
    @Req() req: Request,
  ) {
    return this.commentLikeService.findAllByUserIdAndVideoId(
      req['user'].id,
      +videoId,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentLikeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCommentLikeDto: UpdateCommentLikeDto,
  ) {
    return this.commentLikeService.update(+id, updateCommentLikeDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':commentId')
  async remove(@Param('commentId') commentId: string, @Req() req: Request) {
    const data = await this.commentLikeService.remove(
      +commentId,
      req['user'].id,
    );
    return { code: data ? 200 : 10000 };
  }
}
