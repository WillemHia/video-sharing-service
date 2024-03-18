import { Module } from '@nestjs/common';
import { InteractionService } from './interaction.service';
import { InteractionController } from './interaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interaction } from './entities/interaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Interaction])],
  controllers: [InteractionController],
  providers: [InteractionService],
})
export class InteractionModule {}
