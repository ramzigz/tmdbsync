import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max } from 'class-validator';

export class RateMovieDto {
  @ApiProperty({
    description: 'Rating value for the movie',
    example: 8.5,
    minimum: 1,
    maximum: 10,
    type: Number,
  })
  @IsNumber()
  @Min(1)
  @Max(10)
  rating: number; // Rating value must be between 1 and 10
}
