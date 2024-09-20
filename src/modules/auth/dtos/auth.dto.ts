import { IsNotEmpty, IsString, IsEmail, IsIn, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'Email del usuario', example: 'john_doe@gmail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Contraseña del usuario', example: 'holomundo' })
  password: string;
}


export class AuthCreateUserDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Nombre completo del usuario', example: 'john_doe@gmail.com' })
  full_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Apellidos completo del usuario', example: 'john_doe@gmail.com' })
  last_name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'Email del usuario', example: 'john_doe@gmail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Contraseña del usuario', example: 'holomundo' })
  password: string;
}
