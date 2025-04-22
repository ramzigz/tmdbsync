import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { FindAllMoviesDto } from './dto/find-movies.dto';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { RateMovieDto } from './dto/rate-movie.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all movies with pagination, search, and filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns a paginated list of movies.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Invalid query parameters.',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number for pagination (default: 1)',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of items per page (default: 10)',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    type: String,
    required: false,
    description: 'Search term for filtering movies by title',
    example: '',
  })
  @ApiQuery({
    name: 'adult',
    type: Boolean,
    required: false,
    description: 'Filter movies by adult content (true/false)',
    // example: false,
  })
  @ApiQuery({
    name: 'vote_average',
    type: Number,
    required: false,
    description: 'Filter movies by minimum vote average',
    // example: 7.5,
  })
  @ApiQuery({
    name: 'genres',
    type: String,
    required: false,
    description: 'Filter movies by genre IDs (comma-separated string)',
  })
  @UsePipes(new ValidationPipe({ transform: true })) // Enable transformation
  async findAll(@Query() query: FindAllMoviesDto) {
    const { page, limit, search, adult, vote_average, genres } = query;
    console.log('Transformed Parameters:', {
      page,
      limit,
      search,
      adult,
      vote_average,
      genres,
    });
    return this.moviesService.findAll(
      page,
      limit,
      search,
      adult,
      vote_average,
      genres,
    );
  }

  @Post(':id/rate')
  @ApiOperation({
    summary: 'Rate a movie',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated average rating of the movie.',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data.',
  })
  @ApiResponse({
    status: 404,
    description: 'Movie not found.',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async rateMovie(
    @Param('id') movieId: number,
    @Body() rateMovieDto: RateMovieDto,
  ) {
    const { rating } = rateMovieDto;
    return this.moviesService.rateMovie(movieId, rating);
  }
}
