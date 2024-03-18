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

  @Post()
  async create(
    @Body() createFollowRelationshipDto: CreateFollowRelationshipDto,
  ) {
    const data = await this.followRelationshipService.create(
      createFollowRelationshipDto,
    );
    return { code: `${data ? 200 : 10000}` };
  }

  @Post('follow')
  async userFollow(
    @Body() updateFollowRelationshipDto: UpdateFollowRelationshipDto,
  ) {
    const data = await this.followRelationshipService.userFollow(
      updateFollowRelationshipDto,
    );
    return { code: `${data ? 200 : 10000}` };
  }

  @Put('unfollow')
  async userUnFollow(
    @Body() updateFollowRelationshipDto: UpdateFollowRelationshipDto,
  ) {
    const data = await this.followRelationshipService.userUnFollow(
      updateFollowRelationshipDto,
    );
    return { code: `${data ? 200 : 10000}` };
  }

  @UseGuards(AuthGuard)
  @Get('fans/:followedId')
  getFans(@Param('followedId') followedId: string, @Req() req: Request) {
    if (Number(followedId) === 0) {
      return this.followRelationshipService.getFansCount(req['user'].id);
    } else {
      return this.followRelationshipService.getFansCount(+followedId);
    }
  }

  @UseGuards(AuthGuard)
  @Get('followings/:userId')
  getFollowings(@Param('userId') userId: string, @Req() req: Request) {
    if (Number(userId) === 0) {
      return this.followRelationshipService.getFollowingsCount(req['user'].id);
    } else {
      return this.followRelationshipService.getFollowingsCount(+userId);
    }
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
