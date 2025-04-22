import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { TmdbService } from './tmdb.service';
import { SyncDataDto } from './dto/tmdb.dto';

@ApiTags('TMDB Sync')
@Controller('tmdb')
export class TmdbController {
  constructor(private readonly tmdbService: TmdbService) {}

  @Post('sync')
  @ApiOperation({
    summary: 'Sync movies and genres from TMDB',
    description:
      'Synchronizes movies and genres data from The Movie Database (TMDB) API',
  })
  @ApiBody({
    type: SyncDataDto, // Reference the updated DTO
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully synced data from TMDB',
    schema: {
      type: 'object',
      properties: {
        genres: { type: 'number', description: 'Number of genres synced' },
        movies: { type: 'number', description: 'Number of movies synced' },
        total_pages: {
          type: 'number',
          description: 'Total number of pages available for movies',
        },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async syncData(@Body() body: SyncDataDto) {
    const { include, numberOfMoviesToSync } = body;
    return this.tmdbService.syncData(include, numberOfMoviesToSync);
  }
}
