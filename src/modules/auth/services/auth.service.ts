import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { AuthCreateUserDto, AuthDto } from '../dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UserService } from 'src/modules/user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async login(userCredentials: AuthDto) {
    const { email, password } = userCredentials;
    try {
      const findUser = await this.userService.getByEmail(email);

      if (!findUser) {
        throw new Error('Usuario no encontrado');
      }

      const isValidPassword = await this.validateUserCredentials(
        password,
        findUser.password,
      );

      if (!isValidPassword) {
        throw new Error('Credenciales del usuario invalidas');
      }

      return this.getTokens({
        id: findUser.id,
        full_name: findUser.full_name,
        last_name: findUser.last_name,
        email: findUser.email,
        rol: findUser.rol.code
      })

    } catch (err) {
      throw new UnauthorizedException('Credenciales del usuario invalidas');
    }
  }

  getUserRolesValidated(user: User) {
    return this.userService.getByEmail(user.email);
  }

  async validateUserCredentials(
    passwordCredential: string,
    passwordUser: string,
  ) {
    return await compare(passwordCredential, passwordUser);
  }

  async getTokens(user: any) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(user, { expiresIn: '60m' }),
      this.jwtService.signAsync(user, { expiresIn: '7d' }),
    ]);

    return {
      access_token,
      refresh_token,
    };
  }

  register (user: AuthCreateUserDto) {
    return this.userService.createUser(user)
  }
}
