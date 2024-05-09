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
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { formatUserAvatar } from 'src/utils/format';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    const data = await this.commentService.create(
      createCommentDto,
      req['user'].id,
    );
    return { code: data ? 200 : 10000 };
  }

  @Get('video/:videoId')
  findCountByVideoId(@Param('videoId') videoId: string) {
    return this.commentService.findCountByVideoId(+videoId);
  }

  @Get(':videoId')
  async findAll(@Param('videoId') videoId: string, @Req() req: Request) {
    const data = await this.commentService.findAllByVideoId(+videoId);
    data.map((item) => {
      item.user = formatUserAvatar(item.user, req);
      if (item.replyUser) {
        item.replyUser = formatUserAvatar(item.replyUser, req);
      }
    });
    return data;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentService.remove(+id);
  }
}
