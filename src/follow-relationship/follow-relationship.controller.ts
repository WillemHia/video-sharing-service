import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FollowRelationshipService } from './follow-relationship.service';
import { CreateFollowRelationshipDto } from './dto/create-follow-relationship.dto';
import { UpdateFollowRelationshipDto } from './dto/update-follow-relationship.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';

@Controller('follow-relationship')
export class FollowRelationshipController {
  constructor(
    private readonly followRelationshipService: FollowRelationshipService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createFollowRelationshipDto: CreateFollowRelationshipDto,
  ) {
    const data = await this.followRelationshipService.create(
      createFollowRelationshipDto,
    );
    return { code: data ? 200 : 10000 };
  }

  @UseGuards(AuthGuard)
  @Post('follow')
  async userFollow(
    @Body() updateFollowRelationshipDto: UpdateFollowRelationshipDto,
    @Req() req: Request,
  ) {
    const data = await this.followRelationshipService.userFollow(
      req['user'].id,
      updateFollowRelationshipDto,
    );
    return { code: data ? 200 : 10000 };
  }

  @UseGuards(AuthGuard)
  @Put('unfollow')
  async userUnFollow(
    @Body() updateFollowRelationshipDto: UpdateFollowRelationshipDto,
    @Req() req: Request,
  ) {
    const data = await this.followRelationshipService.userUnFollow(
      req['user'].id,
      updateFollowRelationshipDto,
    );
    return { code: `${data ? 200 : 10000}` };
  }

  @Get('fans/:followedId')
  getFans(@Param('followedId') followedId: string) {
    return this.followRelationshipService.getFansCount(+followedId);
  }

  @UseGuards(AuthGuard)
  @Get('followings/:userId')
  async getFollowings(@Param('userId') userId: string, @Req() req: Request) {
    if (Number(userId) === 0) {
      return this.followRelationshipService.getFollowingsCount(req['user'].id);
    } else {
      return this.followRelationshipService.getFollowingsCount(+userId);
    }
  }

  @Get(':userId/:videoId')
  findOneByUserIdAndVideoId(
    @Param('userId') userId: string,
    @Param('videoId') videoId: string,
  ) {
    return this.followRelationshipService.findOneByUserIdAndVideoId(
      +userId,
      +videoId,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.followRelationshipService.findOne(+id, req['user'].id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFollowRelationshipDto: UpdateFollowRelationshipDto,
  ) {
    return this.followRelationshipService.update(
      +id,
      updateFollowRelationshipDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followRelationshipService.remove(+id);
  }
}
