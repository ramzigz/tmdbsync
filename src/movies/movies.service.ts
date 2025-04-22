import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from './entities/movie.entity';
import { Op } from 'sequelize';
import { Genre } from 'src/genres/entities/genre.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie)
    private movieModel: typeof Movie,
  ) {}

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
    adult?: boolean,
    vote_average?: number,
    genres?: string,
  ) {
    const offset = (page - 1) * limit;

    const whereClause: Partial<Record<string, any>> = {};

    if (search) {
      whereClause.title = {
        [Op.iLike]: `%${search}%`,
      };
    }

    if (adult !== undefined) {
      whereClause.adult = adult;
    }

    if (vote_average !== undefined) {
      whereClause.vote_average = {
        [Op.gte]: vote_average,
      };
    }

    let genreIds: number[] | undefined;
    if (genres) {
      genreIds = genres.split(',').map((id) => parseInt(id.trim(), 10));
    }

    const { rows, count } = await this.movieModel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Genre,
          attributes: ['id', 'name'],
          through: { attributes: [] }, // Exclude join table fields
          where: genres
            ? {
                id: {
                  [Op.in]: genreIds, // Filter genres by ID
                },
              }
            : undefined,
        },
      ],
      limit,
      offset,
      order: [['id', 'ASC']],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
    };
  }

  async rateMovie(movieId: number, rating: number) {
    // Validate that the movie exists
    const movie = await this.movieModel.findByPk(movieId, { raw: true });
    if (!movie) {
      throw new NotFoundException('Movie not found'); // Return HTTP 404 error
    }

    // Calculate the new average rating
    const totalVotes = movie.vote_count * movie.vote_average; // Total sum of all ratings so far
    const newVoteCount = movie.vote_count + 1; // Increment the vote count
    const newVoteAverage = parseFloat(
      ((totalVotes + rating) / newVoteCount).toFixed(3),
    );

    // Update the movie's vote_average and vote_count directly
    await this.movieModel.update(
      { vote_average: newVoteAverage, vote_count: newVoteCount },
      { where: { id: movieId } },
    );

    return { vote_average: newVoteAverage, vote_count: newVoteCount };
  }
}
