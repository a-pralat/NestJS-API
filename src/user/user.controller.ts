import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { EditUserDto, UserResponseDto } from './dto';
import { UserService } from './user.service';
import { plainToInstance } from 'class-transformer';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return plainToInstance(UserResponseDto, user);
  }

  @Patch()
  async editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    const user = await this.userService.editUser(userId, dto);
    return plainToInstance(UserResponseDto, user);
  }
}
