import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class MovieWatchlistDto {
  @ApiProperty({
    description: 'Anonymous user identifier (e.g., session ID)',
    example: 'user123',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'ID of the movie to add to the watchlist',
    example: 5,
  })
  @IsNumber()
  movieId: number;
}
