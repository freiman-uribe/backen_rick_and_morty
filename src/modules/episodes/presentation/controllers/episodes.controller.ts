import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { EpisodesService } from '../../infrastructure/prisma/services/episodes.service';
import { UpdateEpisodeDto } from '../../domain/dto/update-episode.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('episode')
@ApiTags('Controlador de episodios')
@UseGuards(AuthGuard, AdminGuard)
export class EpisodesController {
  constructor(private readonly episodesService: EpisodesService) {}

  @Post('import')
  @ApiOperation({
    summary: 'Importar todos los personajes.',
  })
  create() {
    return this.episodesService.create();
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los personajes.',
  })
  findAll() {
    return this.episodesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un personaje por su id.',
  })
  findOne(@Param('id') id: string) {
    return this.episodesService.findOne(id);
  }

  // @Patch(':id')
  // @ApiOperation({
  //   summary: 'Actualizar un personaje por su id.',
  // })
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCharacterDto: UpdateEpisodeDto,
  //   @Req() req,
  // ) {
  //   this.episodesService.userId = req.user.id;
  //   return this.episodesService.update(id, updateCharacterDto);
  // }

  @Post(':id/characters')
  @ApiOperation({
    summary: 'Agregar un personajes a episodio.',
  })
  addCharacterToEpisodes(
    @Param('id') id: string,
    @Body() body: { characterIds: string[] },
  ) {
    const { characterIds } = body;
    return this.episodesService.addCharacterToEpisodes(id, characterIds);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un personaje por su id.',
  })
  remove(@Param('id') id: string, @Req() req) {
    this.episodesService.userId = req.user.id;
    return this.episodesService.remove(id);
  }
}
