import { Injectable } from '@nestjs/common';
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
    // Default values for pagination
    const offset = (page - 1) * limit;

    // Define the whereClause with a proper type
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

  async findOne(id: number) {
    return this.movieModel.findByPk(id);
  }
}
