import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber } from "class-validator";


export class CreateCharacterDto {
  @IsNumber()
  @ApiProperty({ description: 'id anterior del personaje', example: 1 })
  old_id: number;

  @IsString()
  @ApiProperty({ description: 'Nombre del personaje', example: 'Juan' })
  name: string;

  @IsString()
  @ApiProperty({ description: 'Estado del personaje', example: 'Alive' })
  status: string;

  @IsString()
  @ApiProperty({ description: 'Especie del personaje', example: 'Human' })
  species: string;

  @IsString()
  @ApiProperty({ description: 'Typo del personaje', example: 'Parasite' })
  type: string;

  @IsString()
  @ApiProperty({ description: 'Genero del personaje', example: 'Male' })
  gender: string;

  @IsString()
  @ApiProperty({ description: 'Genero del personaje', example: 'Male' })
  image: string;

  //   @ApiProperty({ description: 'Valor por dia', example: 10000 })
  //   amount_perday: number;

  //   @IsNumber()
  //   @ApiProperty({ description: 'Cantidad de dias', example: 30 })
  //   equals_day: number;
}
