import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';

@Injectable()
export class PokemonsService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonsRepository: Repository<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto, userId: string) {
    const pokemon = this.pokemonsRepository.create({
      ...createPokemonDto,
      createdById: userId,
    });

    const savedPokemon = await this.pokemonsRepository.save(pokemon);

    return {
      message: 'Pokemon created successfully',
      pokemon: savedPokemon,
    };
  }

  async findAll() {
    const pokemons = await this.pokemonsRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['createdBy'],
    });

    return pokemons.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.type,
      level: pokemon.level,
      hp: pokemon.hp,
      pokedexNumber: pokemon.pokedexNumber,
      createdAt: pokemon.createdAt,
      updatedAt: pokemon.updatedAt,
      createdBy: {
        id: pokemon.createdBy?.id,
        name: pokemon.createdBy?.name,
        email: pokemon.createdBy?.email,
      },
    }));
  }
}