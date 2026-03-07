import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonsService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonsRepository: Repository<Pokemon>,
  ) {}

  private formatPokemon(pokemon: Pokemon) {
    return {
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.type,
      level: pokemon.level,
      hp: pokemon.hp,
      pokedexNumber: pokemon.pokedexNumber,
      createdAt: pokemon.createdAt,
      updatedAt: pokemon.updatedAt,
      createdBy: pokemon.createdBy
        ? {
            id: pokemon.createdBy.id,
            name: pokemon.createdBy.name,
            email: pokemon.createdBy.email,
          }
        : undefined,
    };
  }

  async create(createPokemonDto: CreatePokemonDto, userId: string) {
    const pokemon = this.pokemonsRepository.create({
      ...createPokemonDto,
      createdById: userId,
    });

    const savedPokemon = await this.pokemonsRepository.save(pokemon);

    const createdPokemon = await this.pokemonsRepository.findOne({
      where: { id: savedPokemon.id },
      relations: ['createdBy'],
    });

    return {
      message: 'Pokemon created successfully',
      pokemon: this.formatPokemon(createdPokemon as Pokemon),
    };
  }

  async findAll() {
    const pokemons = await this.pokemonsRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: ['createdBy'],
    });

    return {
      message: 'Pokemons retrieved successfully',
      data: pokemons.map((pokemon) => this.formatPokemon(pokemon)),
    };
  }

  async findOne(id: string) {
    const pokemon = await this.pokemonsRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!pokemon) {
      throw new NotFoundException('Pokemon not found');
    }

    return {
      message: 'Pokemon retrieved successfully',
      pokemon: this.formatPokemon(pokemon),
    };
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto, userId: string) {
    const pokemon = await this.pokemonsRepository.findOne({
      where: { id },
    });

    if (!pokemon) {
      throw new NotFoundException('Pokemon not found');
    }

    if (pokemon.createdById !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this pokemon',
      );
    }

    Object.assign(pokemon, updatePokemonDto);

    await this.pokemonsRepository.save(pokemon);

    const updatedPokemon = await this.pokemonsRepository.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    return {
      message: 'Pokemon updated successfully',
      pokemon: this.formatPokemon(updatedPokemon as Pokemon),
    };
  }

  async remove(id: string, userId: string) {
    const pokemon = await this.pokemonsRepository.findOne({
      where: { id },
    });

    if (!pokemon) {
      throw new NotFoundException('Pokemon not found');
    }

    if (pokemon.createdById !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this pokemon',
      );
    }

    await this.pokemonsRepository.remove(pokemon);

    return {
      message: 'Pokemon deleted successfully',
    };
  }
}