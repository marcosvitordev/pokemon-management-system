import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class CreatePokemonDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  level: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  hp: number;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pokedexNumber: number;

  @ApiProperty({ required: false, example: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png' })
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}