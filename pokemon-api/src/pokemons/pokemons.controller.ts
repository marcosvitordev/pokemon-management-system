import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { CreatePokemonDto } from './dto/create-pokemon.dto';

@Controller('pokemons')
@UseGuards(JwtAuthGuard)
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Post()
  create(
    @Body() createPokemonDto: CreatePokemonDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.pokemonsService.create(createPokemonDto, user.userId);
  }

  @Get()
  findAll() {
    return this.pokemonsService.findAll();
  }
}