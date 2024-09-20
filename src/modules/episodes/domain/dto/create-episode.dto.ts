import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsArray, IsNumber } from "class-validator";


export class CreateEpisodeDto {
  @IsNumber()
  @ApiProperty({ description: 'id anterior del episodio', example: 1 })
  old_id: number;

  @IsString()
  @ApiProperty({ description: 'Nombre del episodio', example: 'Pilot' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'Fecha del episodio', example: 'Decembe2, 2013' })
  air_date: string;

  @IsString()
  @ApiProperty({ description: 'Episodio', example: 'S01E01' })
  episode: string;

  @IsArray()
  @ApiProperty({
    description: 'Personajes del episodio',
    example: '[124, ...]',
  })
  characters: Array<string>;

  @IsString()
  @ApiProperty({ description: 'Url del episodio', example: 'https://....' })
  url: string;

  //   @ApiProperty({ description: 'Valor por dia', example: 10000 })
  //   amount_perday: number;

  //   @IsNumber()
  //   @ApiProperty({ description: 'Cantidad de dias', example: 30 })
  //   equals_day: number;
}
