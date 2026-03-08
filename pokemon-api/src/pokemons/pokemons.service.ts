import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository, FindOptionsWhere } from 'typeorm';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { QueryPokemonDto } from './dto/query-pokemon.dto';

@Injectable()
export class PokemonsService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonsRepository: Repository<Pokemon>,
  ) {}

  private getDefaultPokemonImageUrl(pokedexNumber: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokedexNumber}.png`;
  }

  private formatPokemon(pokemon: Pokemon) {
    return {
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.type,
      level: pokemon.level,
      hp: pokemon.hp,
      pokedexNumber: pokemon.pokedexNumber,
      imageUrl: pokemon.imageUrl,
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
    const imageUrl =
      createPokemonDto.imageUrl ||
      this.getDefaultPokemonImageUrl(createPokemonDto.pokedexNumber);

    const pokemon = this.pokemonsRepository.create({
      ...createPokemonDto,
      imageUrl,
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

  async findAll(query: QueryPokemonDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Pokemon> = {};

    if (query.name) {
      where.name = ILike(`%${query.name}%`);
    }

    if (query.type) {
      where.type = ILike(`%${query.type}%`);
    }

    const [pokemons, total] = await this.pokemonsRepository.findAndCount({
      where,
      order: {
        createdAt: 'DESC',
      },
      relations: ['createdBy'],
      skip,
      take: limit,
    });

    return {
      message: 'Pokemons retrieved successfully',
      data: pokemons.map((pokemon) => this.formatPokemon(pokemon)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      filters: {
        name: query.name ?? null,
        type: query.type ?? null,
      },
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

    const finalImageUrl =
      updatePokemonDto.imageUrl ||
      (updatePokemonDto.pokedexNumber
        ? this.getDefaultPokemonImageUrl(updatePokemonDto.pokedexNumber)
        : pokemon.imageUrl);

    Object.assign(pokemon, {
      ...updatePokemonDto,
      imageUrl: finalImageUrl,
    });

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