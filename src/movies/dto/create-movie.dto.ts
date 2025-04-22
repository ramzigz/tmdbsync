import {
  IsBoolean,
  IsArray,
  IsNumber,
  IsString,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Genre } from '../../genres/entities/genre.entity';

export class CreateMovieDto {
  @IsBoolean()
  adult: boolean;

  @IsArray()
  @IsNumber({}, { each: true })
  genre_ids: Genre[];

  @IsNumber()
  id: number;

  @IsString()
  original_language: string;

  @IsString()
  original_title: string;

  @IsString()
  overview: string;

  @IsNumber()
  popularity: number;

  @IsString()
  @IsOptional()
  poster_path: string;

  @IsDate()
  release_date: Date;

  @IsString()
  title: string;

  @IsNumber()
  vote_average: number;

  @IsNumber()
  vote_count: number;
}
