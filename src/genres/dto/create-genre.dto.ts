import { IsString, IsNumber } from 'class-validator';

export class CreateGenreDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;
}
