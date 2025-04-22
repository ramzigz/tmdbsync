import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Movie } from '../movies/entities/movie.entity';
import { MovieWatchlist } from './entities/movie-watchlist.entity';
import { MovieWatchlistService } from './movie-watchlist.service';
import { MovieWatchlistController } from './movie-watchlist.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Movie, MovieWatchlist]), // Ensure both models are registered
  ],
  controllers: [MovieWatchlistController],
  providers: [MovieWatchlistService],
})
export class MovieWatchlistModule {}
