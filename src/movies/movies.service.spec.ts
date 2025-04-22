import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { Genre } from '../genres/entities/genre.entity';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException } from '@nestjs/common';
import { Model } from 'sequelize';

// Utility function to mock a Sequelize Movie instance
function createMockMovieInstance(data: Partial<Movie>): Model<Movie> {
  return {
    ...data,
    _attributes: data,
    dataValues: data,
    isNewRecord: false,
    save: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    reload: jest.fn(),
    toJSON: () => data,
  } as unknown as Model<Movie>;
}

// Utility function to mock a Sequelize Genre instance with Sequelize mixins
function createMockGenreInstance(data: Partial<Genre>): Genre {
  return {
    ...data,
    $add: jest.fn(),
    $set: jest.fn(),
    $get: jest.fn(),
    $count: jest.fn(),
    $create: jest.fn(),
    $has: jest.fn(),
    $remove: jest.fn(),
    $setDataValue: jest.fn(),
    $getDataValue: jest.fn(),
    toJSON: () => data,
    toString: () => JSON.stringify(data),
  } as unknown as Genre;
}

describe('MoviesService', () => {
  let service: MoviesService;
  let movieModel: typeof Movie;

  beforeEach(async () => {
    const mockMovieModel = {
      findAndCountAll: jest.fn(),
      findByPk: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: getModelToken(Movie),
          useValue: mockMovieModel,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    movieModel = module.get<typeof Movie>(getModelToken(Movie));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated movies with filters', async () => {
      const mockGenres: Genre[] = [
        createMockGenreInstance({
          id: 1,
          name: 'Action',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      const mockMovies = [
        createMockMovieInstance({
          id: 1,
          title: 'Action Movie',
          adult: false,
          vote_average: 8.5,
          genres: mockGenres,
        }),
      ];

      jest.spyOn(movieModel, 'findAndCountAll').mockResolvedValue({
        rows: mockMovies,
        count: [{ count: mockMovies.length, rows: mockMovies }],
      });

      const result = await service.findAll(1, 10, 'Action', false, 7.0, '1');

      expect(result).toEqual({
        data: mockMovies.map((m) => m.toJSON()),
        total: mockMovies.length,
        page: 1,
        limit: 10,
      });

      const boundFindAndCountAll = movieModel.findAndCountAll.bind(movieModel);
      expect(boundFindAndCountAll).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      jest.spyOn(movieModel, 'findAndCountAll').mockResolvedValue({
        rows: [],
        count: [],
      });

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
      });
    });
  });

  describe('rateMovie', () => {
    it('should rate a movie and return the updated average', async () => {
      const mockMovie = createMockMovieInstance({
        id: 1,
        vote_average: 8.0,
        vote_count: 10,
      });

      jest.spyOn(movieModel, 'findByPk').mockResolvedValue(mockMovie);

      jest.spyOn(movieModel, 'update').mockResolvedValue([1]);

      const result = await service.rateMovie(1, 9.0);

      expect(result).toEqual({
        vote_average: 8.091,
        vote_count: 11,
      });

      const boundUpdate = movieModel.update.bind(movieModel);
      expect(boundUpdate).toHaveBeenCalledWith(
        { vote_average: 8.091, vote_count: 11 },
        { where: { id: 1 } },
      );
    });

    it('should throw NotFoundException if movie does not exist', async () => {
      jest.spyOn(movieModel, 'findByPk').mockResolvedValue(null);

      await expect(service.rateMovie(999, 9.0)).rejects.toThrow(
        NotFoundException,
      );
      const boundUpdate = movieModel.update.bind(movieModel);
      expect(boundUpdate).not.toHaveBeenCalled();
    });
  });
});
