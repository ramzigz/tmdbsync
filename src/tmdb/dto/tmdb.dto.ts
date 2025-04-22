import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, Matches } from 'class-validator';

export class SyncDataDto {
  @ApiProperty({
    type: 'number',
    description: 'The number of items (movies) to sync from TMDB',
    example: 50,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  numberOfMoviesToSync: number; // Number of movies to sync

  @ApiProperty({
    type: 'string',
    description:
      'Comma-separated list of data types to sync (e.g., genres,movies). If omitted, all data types are synced.',
    example: 'genres,movies',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Matches(/^(genres|movies)(,(genres|movies))*$/, {
    message:
      'Invalid include value. Must be a comma-separated list of "genres" and/or "movies".',
  })
  include?: string; // Optional: Data types to sync
}
