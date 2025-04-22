import { Transform } from 'class-transformer';
import {
  IsInt,
  Min,
  IsOptional,
  IsString,
  IsBoolean,
  IsNumber,
} from 'class-validator';

export class FindAllMoviesDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => {
    return Number(value);
  })
  @Min(1)
  page = 1;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => {
    return Number(value);
  })
  @Min(1)
  limit = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return Boolean(value);
  })
  @IsBoolean()
  adult?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    return Number(value);
  })
  @Min(0)
  vote_average?: number;

  @IsOptional()
  @IsString()
  genres?: string;
}
