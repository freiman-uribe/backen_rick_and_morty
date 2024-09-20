import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CharactersService } from '../../infrastructure/prisma/services/characters.service';
import { UpdateCharacterDto } from '../../domain/dto/update-character.dto';
import { AuthGuard } from 'src/modules/auth/guards/auth.guard';
import { AdminGuard } from 'src/modules/auth/guards/admin.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('character')
@ApiTags('Controlador de personajes')
@UseGuards(AuthGuard, AdminGuard)
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  @Post('import')
  @ApiOperation({
    summary: 'Importar todos los personajes.',
  })
  create() {
    try {
      return this.charactersService.create();
    } catch (error) {
      console.log('🚀 ~ CharactersController ~ create ~ error:', error);
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los personajes.',
  })
  findAll() {
    return this.charactersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un personaje por su id.',
  })
  findOne(@Param('id') id: string) {
    return this.charactersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar un personaje por su id.',
  })
  update(
    @Param('id') id: string,
    @Body() updateCharacterDto: UpdateCharacterDto,
    @Req() req,
  ) {
    this.charactersService.userId = req.user.id;
    return this.charactersService.update(id, updateCharacterDto);
  }

  @Post(':id/episodes')
  @ApiOperation({
    summary: 'Agregar un episodios a personaje.',
  })
  addCharacterToEpisodes(
    @Param('id') id: string,
    @Body() body: { episodeIds: string[] },
  ) {
    const { episodeIds } = body;
    return this.charactersService.addEpisodeToCharacters(id, episodeIds);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar un personaje por su id.',
  })
  remove(@Param('id') id: string, @Req() req) {
    this.charactersService.userId = req.user.id;
    return this.charactersService.remove(id);
  }
}
