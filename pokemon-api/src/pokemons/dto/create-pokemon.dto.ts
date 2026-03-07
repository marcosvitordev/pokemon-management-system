import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePokemonDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  level: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  hp: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  pokedexNumber: number;
}