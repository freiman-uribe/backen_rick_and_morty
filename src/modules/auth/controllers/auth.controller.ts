import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthCreateUserDto, AuthDto } from '../dtos/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Controlador de la autenticación')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Iniciar sesión y obtener token de acceso.',
  })
  @ApiResponse({
    status: 201,
    description: 'Éxito. Devuelve el token de acceso.',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized Request',
  })
  async singIn(@Body() user: AuthDto){
    return this.authService.login(user);
  }

  @Post('register')
  async singUp(@Body() user: AuthCreateUserDto){
    return this.authService.register(user);
  }
}
