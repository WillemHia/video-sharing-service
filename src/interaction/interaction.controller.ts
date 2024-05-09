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
import { InteractionService } from './interaction.service';
import { CreateInteractionDto } from './dto/create-interaction.dto';
import { UpdateInteractionDto } from './dto/update-interaction.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('interaction')
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Post()
  create(@Body() createInteractionDto: CreateInteractionDto) {
    return this.interactionService.create(createInteractionDto);
  }

  @UseGuards(AuthGuard)
  @Get('user/:userId')
  findCountByUserId(@Param('userId') userId: string, @Req() req: Request) {
    if (Number(userId) === 0) {
      return this.interactionService.findCountByUserId(req['user'].id);
    } else {
      return this.interactionService.findCountByUserId(Number(userId));
    }
  }

  @Get('video/:videoId')
  findCountByVideoId(@Param('videoId') videoId: string) {
    return this.interactionService.findCountByVideoId(+videoId);
  }

  @Get('count/user/:userId')
  findInteractionCountByUserId(@Param('userId') userId: string) {
    return this.interactionService.getTotalInteractionsByUserId(Number(userId));
  }

  @Get(':userId/:videoId')
  findOneByUserIdAndVideoId(
    @Param('userId') userId: string,
    @Param('videoId') videoId: string,
  ) {
    return this.interactionService.findOneByUserIdAndVideoId(+userId, +videoId);
  }

  @UseGuards(AuthGuard)
  @Put()
  async updateInteractionType(
    @Body() updateInteractionDto: UpdateInteractionDto,
    @Req() req: Request,
  ) {
    const data = await this.interactionService.updateInteractionType(
      req['user'].id,
      updateInteractionDto.videoId,
      updateInteractionDto.interactionType,
    );
    return { code: data ? 200 : 10000 };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInteractionDto: UpdateInteractionDto,
  ) {
    return this.interactionService.update(+id, updateInteractionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interactionService.remove(+id);
  }
}
