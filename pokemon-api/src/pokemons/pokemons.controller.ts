import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserType } from '../auth/types/current-user.type';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pokemonsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    return this.pokemonsService.update(id, updatePokemonDto, user.userId);
  }
}