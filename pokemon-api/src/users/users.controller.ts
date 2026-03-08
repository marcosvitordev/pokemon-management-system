// import { Controller, Get, UseGuards } from '@nestjs/common';
// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { CurrentUser } from '../auth/decorators/current-user.decorator';
// import type { CurrentUserType } from '../auth/types/current-user.type';

// @ApiTags('Users')
// @Controller('users')
// export class UsersController {
//   @ApiBearerAuth('Bearer')
//   @UseGuards(JwtAuthGuard)
//   @Get('me')
//   me(@CurrentUser() user: CurrentUserType) {
//     return {
//       user,
//     };
//   }
// }


// src/users/users.controller.ts
import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  // Injetar o UsersService no construtor
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: CurrentUserType) {
    // Buscar os dados completos (incluindo avatarUrl) da base de dados
    const fullUser = await this.usersService.findById(user.userId);
    // Remover a senha antes de devolver
    if (!fullUser) {
      return { user: null };
    }
    const { passwordHash, ...result } = fullUser; 
    return { user: result };
  }

  @ApiBearerAuth('Bearer')
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(
    @CurrentUser() user: CurrentUserType,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const updatedUser = await this.usersService.update(user.userId, updateUserDto);
    if (!updatedUser) {
      return { message: 'Usuário não encontrado', user: null };
    }
    const { passwordHash, ...result } = updatedUser;
    return { message: 'Perfil atualizado com sucesso', user: result };
  }
}