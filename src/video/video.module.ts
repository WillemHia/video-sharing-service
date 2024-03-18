import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Video } from './entities/video.entity';
import { LabelModule } from 'src/label/label.module';
import { Interaction } from 'src/interaction/entities/interaction.entity';
import { Collect } from 'src/collect/entities/collect.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video, Interaction, Collect]),
    LabelModule,
  ],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule {}
