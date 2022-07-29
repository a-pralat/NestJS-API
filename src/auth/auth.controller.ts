import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { DuplicateUserError } from '../prisma/domain/errors/duplicate-user.error';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() dto: AuthDto) {
    try {
      return await this.authService.signUp(dto);
    } catch (e) {
      switch (true) {
        case e instanceof DuplicateUserError:
          throw new BadRequestException('Email already taken');
      }
      Logger.error(e);
      throw e;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() dto: AuthDto) {
    return this.authService.signIn(dto);
  }
}
