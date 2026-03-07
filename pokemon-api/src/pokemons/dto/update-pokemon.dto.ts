import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class UpdatePokemonDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  level?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  hp?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pokedexNumber?: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}