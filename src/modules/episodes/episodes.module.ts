import { Module } from '@nestjs/common';
import { EpisodesController } from './presentation/controllers/episodes.controller';
import { EpisodesService } from './infrastructure/prisma/services/episodes.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Module({
  controllers: [EpisodesController],
  providers: [EpisodesService, PrismaService],
})
export class EpisodesModule {}
