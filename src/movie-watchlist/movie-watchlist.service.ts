import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from '../movies/entities/movie.entity';
import { MovieWatchlist } from './entities/movie-watchlist.entity';
import { MovieWatchlistDto } from './dto/movie-watchlist.dto';

@Injectable()
export class MovieWatchlistService {
  constructor(
    @InjectModel(MovieWatchlist)
    private movieWatchlistModel: typeof MovieWatchlist,
    @InjectModel(Movie)
    private movieModel: typeof Movie,
  ) {}

  async addToWatchlist(addToWatchlistDto: MovieWatchlistDto) {
    const { userId, movieId } = addToWatchlistDto;

    const movie = await this.movieModel.findByPk(movieId);
    if (!movie) {
      throw new NotFoundException('Movie not found');
    }

    const [watchlistEntry] = await this.movieWatchlistModel.findOrCreate({
      where: { userId, movieId },
      defaults: { isInWatchlist: true },
    });

    if (!watchlistEntry.isInWatchlist) {
      watchlistEntry.isInWatchlist = true;
      await watchlistEntry.save();
    }

    return { message: 'Movie added to watchlist' };
  }

  async getWatchlist(userId: string) {
    const watchlist = await this.movieWatchlistModel.findAll({
      where: { userId, isInWatchlist: true },
      include: [
        {
          model: Movie,
          attributes: ['id', 'title', 'overview', 'vote_average'],
        },
      ],
    });

    return watchlist.map((entry) => entry.get('movie'));
  }
}
