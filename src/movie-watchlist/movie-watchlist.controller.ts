import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MovieWatchlistService } from './movie-watchlist.service';
import { ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { MovieWatchlistDto } from './dto/movie-watchlist.dto';

@Controller('watchlist')
export class MovieWatchlistController {
  constructor(private readonly movieWatchlistService: MovieWatchlistService) {}

  @Post()
  @ApiOperation({
    summary: "Add a movie to the user's watchlist",
  })
  @ApiResponse({
    status: 200,
    description: 'Movie successfully added to the watchlist.',
  })
  @ApiBody({
    type: MovieWatchlistDto,
    description: 'Details to add a movie to the watchlist',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async addToWatchlist(@Body() addToWatchlistDto: MovieWatchlistDto) {
    return this.movieWatchlistService.addToWatchlist(addToWatchlistDto);
  }

  @Get()
  @ApiOperation({
    summary: "Get the user's watchlist",
  })
  @ApiResponse({
    status: 200,
    description: "Returns the list of movies in the user's watchlist.",
  })
  @ApiQuery({
    name: 'userId',
    type: String,
    required: true,
    description: 'Anonymous user identifier (e.g., session ID)',
    example: 'user123',
  })
  async getWatchlist(@Query('userId') userId: string) {
    return this.movieWatchlistService.getWatchlist(userId);
  }

  @Delete()
  @ApiOperation({
    summary: "Remove a movie from the user's watchlist",
  })
  @ApiResponse({
    status: 200,
    description: 'Movie successfully removed from the watchlist.',
  })
  @ApiBody({
    type: MovieWatchlistDto,
    description: 'Details to remove a movie from the watchlist',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async removeFromWatchlist(@Body() removeFromWatchlistDto: MovieWatchlistDto) {
    return this.movieWatchlistService.removeFromWatchlist(
      removeFromWatchlistDto,
    );
  }
}
