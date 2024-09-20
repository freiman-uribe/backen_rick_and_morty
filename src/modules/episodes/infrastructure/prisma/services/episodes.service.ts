import { Injectable } from '@nestjs/common';
import { UpdateEpisodeDto } from '../../../domain/dto/update-episode.dto';
import { PrismaService } from '../../../../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class EpisodesService {
  private _userId: string;

  set userId(value: string) {
    this._userId = value;
  }

  constructor(private prisma: PrismaService) {}

  async create() {
    const MAX_PAGINAS = 3; // Estimación de páginas máximas
    const batchSize = 100; // Número de caracteres por página para optimizar el rendimiento

    let currentPage = 1;
    let totalPages = 0;
    let processedCount = 0;

    while (currentPage <= MAX_PAGINAS) {
      try {
        const response = await axios.get(
          `https://rickandmortyapi.com/api/episode/?page=${currentPage}`,
        );

        const episodes = response.data.results;
        totalPages = Math.max(totalPages, response.data.info.pages);

        for (const epis of episodes) {
          const newIds = await Promise.all(
            epis.characters.map(async (character) => {
              const idCharacter = character.split('/').pop();
              const car = await this.prisma.characters.findFirst({
                where: {
                  old_id: parseInt(idCharacter),
                },
              });
              return {
                character: {
                  connect: { id: `${car.id}` },
                },
              };
            }),
          );
          await this.prisma.episodes.create({
            data: {
              old_id: epis.id,
              name: epis.name,
              air_date: epis.air_date,
              episode: epis.episode,
              characters: {
                create: newIds,
              },
              url: epis.url,
            },
          });
          processedCount++;

          if (processedCount % batchSize === 0) {
            console.log(
              `Procesados ${processedCount} episodios en ${currentPage} páginas`,
            );
          }
        }

        currentPage++;
      } catch (error) {
        console.error(`Error al obtener página ${currentPage}:`, error);
        break;
      }
    }

    console.log(`Total de episodios procesados: ${processedCount}`);
    return {
      message: 'Episodes imported successfully',
      count: processedCount,
    };
  }

  findAll() {
    return this.prisma.episodes.findMany({
      include: {
        characters: {
          include: {
            character: true, // Esto incluye la información de cada personaje relacionado
          },
        },
      },
    });

    // return this.prisma.episodes.findMany();
  }

  findOne(id: string) {
    return this.prisma.episodes.findUnique({
      where: {
        id: id,
      },
      include: {
        characters: {
          include: {
            character: true, // Esto incluye la información de cada personaje relacionado
          },
        },
      },
    });
  }

  // update(id: string, updateCharacterDto: UpdateEpisodeDto) {
    // return this.prisma.episodes.update({
    //   where: {
    //     id: id,
    //   },
    //   data: {
    //     modified_by: this._userId,
    //     updated_at: new Date(),
    //     name: updateCharacterDto.name,
    //     status: updateCharacterDto.status,
    //     species: updateCharacterDto.species,
    //     type: updateCharacterDto.type || null,
    //     gender: updateCharacterDto.gender,
    //     image: updateCharacterDto.image,
    //   },
    // });
  // }
  async addCharacterToEpisodes(id: string, characterIds: string[]) {
    try {
      const episodes = await this.prisma.episodeCharacter.findMany({
        where: {
          AND: [
            { episodeId: { equals: id } },
            { characterId: { in: characterIds } },
          ],
        },
      });
      const episodeIdsFound = episodes.map((episode) => episode.characterId);
      const notFoundCharacters = characterIds.filter((id) => !episodeIdsFound.includes(id));

      notFoundCharacters.forEach(async (idChar) => {
        await this.prisma.episodeCharacter.create({
          data: {
            episodeId: id,
            characterId: idChar,
          },
        });
      });
    } catch (error) {
      console.log('🚀 ~ addCharacterToEpisodes ~ error:', error);
    }
  }
  async remove(id: string) {
    console.log('🚀 ~ EpisodesService ~ remove ~ id:', id)
    try {
      await this.prisma.episodeCharacter.deleteMany({
        where: {
          episodeId: id,
        },
      });
      return await this.prisma.episodes.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      console.error('🚀 ~ EpisodesService ~ remove ~ error:', error);
    }
  }
}
