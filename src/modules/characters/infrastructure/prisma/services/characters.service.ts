import { Injectable } from '@nestjs/common';
import { UpdateCharacterDto } from '../../../domain/dto/update-character.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class CharactersService {
  private _userId: string;

  set userId(value: string) {
    this._userId = value;
  }

  constructor(private prisma: PrismaService) {}

  async create() {
    const MAX_PAGINAS = 42; // Estimación de páginas máximas
    const batchSize = 100; // Número de caracteres por página para optimizar el rendimiento

    let currentPage = 1;
    let totalPages = 0;
    let processedCount = 0;

    while (currentPage <= MAX_PAGINAS) {
      try {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/character/?page=${currentPage}`,
        );

        const characters = response.data.results;
        totalPages = Math.max(totalPages, response.data.info.pages);

        // Procesar los caracteres de esta página
        for (const char of characters) {
          await this.prisma.characters.create({
            data: {
              old_id: char.id,
              name: char.name,
              status: char.status,
              species: char.species,
              type: char.type || null,
              gender: char.gender,
              image: char.image,
            },
          });
          processedCount++;

          if (processedCount % batchSize === 0) {
            console.log(
              `Procesados ${processedCount} personajes en ${currentPage} páginas`,
            );
          }
        }

        currentPage++;
      } catch (error) {
        console.error(`Error al obtener página ${currentPage}:`, error);
        break;
      }
    }

    console.log(`Total de personajes procesados: ${processedCount}`);
    return {
      message: 'Characters imported successfully',
      count: processedCount,
    };
    //  const response = await axios.get(
    //    'https://rickandmortyapi.com/api/character',
    //  );
    //  console.log('🚀 ~ create ~ response:', response.data.info.next);
    //  const characters = response.data.results;

    //  for (const char of characters) {
    //    await this.prisma.characters.create({
    //      data: {
    //        name: char.name,
    //        status: char.status,
    //        species: char.species,
    //        type: char.type || null,
    //        gender: char.gender,
    //        image: char.image,
    //      },
    //    });
    //  }
    //  return { message: 'Characters imported successfully' };

    // return this.prisma.characters.create({
    //   data: {
    //     created_by: this._userId,
    //     modified_by: this._userId,
    //     name: createCharacterDto.name,
    //     amount_perday: createCharacterDto.amount_perday,
    //     equals_day: createCharacterDto.equals_day,
    //   }
    // });
  }

  findAll() {
    // return this.prisma.characters.findMany();
    return this.prisma.characters.findMany({
      include: {
        episodes: {
          include: {
            episode: true, // Esto incluye la información de cada personaje relacionado
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.characters.findUnique({
      where: {
        id: id,
      },
      include: {
        episodes: {
          include: {
            episode: true,
          },
        },
      },
    });
  }

  update(id: string, updateCharacterDto: UpdateCharacterDto) {
    return this.prisma.characters.update({
      where: {
        id: id,
      },
      data: {
        modified_by: this._userId,
        updated_at: new Date(),
        name: updateCharacterDto.name,
        status: updateCharacterDto.status,
        species: updateCharacterDto.species,
        type: updateCharacterDto.type || null,
        gender: updateCharacterDto.gender,
        image: updateCharacterDto.image,
      },
    });
  }

  async addEpisodeToCharacters(id: string, episodeIds: string[]) {
    try {
      const episodes = await this.prisma.episodeCharacter.findMany({
        where: {
          AND: [
            { characterId: { equals: id } },
            { episodeId: { in: episodeIds } },
          ],
        },
      });
      const episodeIdsFound = episodes.map((episode) => episode.episodeId);
      const notFoundEpisodes = episodeIds.filter(
        (id) => !episodeIdsFound.includes(id),
      );

      notFoundEpisodes.forEach(async (idEpi) => {
        await this.prisma.episodeCharacter.create({
          data: {
            characterId: id,
            episodeId: idEpi,
          },
        });
      });
    } catch (error) {
      console.log('🚀 ~ addCharacterToEpisodes ~ error:', error);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.episodeCharacter.deleteMany({
        where: {
          characterId: id,
        },
      });
      return await this.prisma.characters.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.error('🚀 ~ EpisodesService ~ remove ~ error:', error);
    }
  }
}
