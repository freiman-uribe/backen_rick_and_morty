import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './modules/prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { CharactersModule } from './modules/characters/characters.module';
import { EpisodesModule } from './modules/episodes/episodes.module';

@Module({
  imports: [AuthModule, UserModule, CharactersModule, EpisodesModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
