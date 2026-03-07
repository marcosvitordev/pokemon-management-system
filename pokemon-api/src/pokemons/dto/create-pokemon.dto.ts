import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

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
}