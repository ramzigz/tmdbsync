import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Movie } from './entities/movie.entity';
import { Op } from 'sequelize';

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
  ) {
    // Default values for pagination
    const offset = (page - 1) * limit;

    // Define the whereClause with a proper type
    const whereClause: Partial<Record<string, any>> = {};

    if (search) {
      whereClause.title = {
        [Op.iLike]: `%${search}%`, // Case-insensitive search for the 'title' field
      };
    }

    if (adult !== undefined) {
      whereClause.adult = adult; // Add filter for adult content
    }

    if (vote_average !== undefined) {
      whereClause.vote_average = {
        [Op.gte]: vote_average, // Add filter for minimum vote average
      };
    }
    const { rows, count } = await this.movieModel.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['id', 'ASC']], // Order results by ID or any other field
    });

    return {
      data: rows, // The paginated list of movies
      total: count, // Total number of movies matching the query
      page,
      limit,
    };
  }

  async findOne(id: number) {
    return this.movieModel.findByPk(id);
  }
}
