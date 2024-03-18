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

  @UseGuards(AuthGuard)
  @Get('count/user/:userId')
  findInteractionCountByUserId(
    @Param('userId') userId: string,
    @Req() req: Request,
  ) {
    if (Number(userId) === 0) {
      return this.interactionService.getTotalInteractionsByUserId(
        req['user'].id,
      );
    } else {
      return this.interactionService.getTotalInteractionsByUserId(
        Number(userId),
      );
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interactionService.findOne(+id);
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
