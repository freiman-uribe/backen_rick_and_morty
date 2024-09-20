import { Module } from '@nestjs/common';
import { CharactersController } from './presentation/controllers/characters.controller';
import { CharactersService } from './infrastructure/prisma/services/characters.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Module({
  controllers: [CharactersController],
  providers: [CharactersService, PrismaService],
})
export class CharactersModule {}
