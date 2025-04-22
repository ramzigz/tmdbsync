import { Test, TestingModule } from '@nestjs/testing';
import { Movie } from '../movies/entities/movie.entity';
import { getModelToken } from '@nestjs/sequelize';
import { Model } from 'sequelize';
import { MovieWatchlistService } from 'src/movie-watchlist/movie-watchlist.service';
import { MovieWatchlist } from 'src/movie-watchlist/entities/movie-watchlist.entity';

// Generic mock instance creator
const createMockInstance = <T extends {}>(data: Partial<T>): T & Model =>
  ({
    ...data,
    _attributes: data,
    dataValues: data,
    isNewRecord: false,
    save: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
    reload: jest.fn(),
    toJSON: () => data,
    get: () => data, // Fix: added .get method to simulate Sequelize instance
  }) as unknown as T & Model;

describe('MovieWatchlistService', () => {
  let service: MovieWatchlistService;
  let movieModel: { findByPk: jest.Mock };
  let watchlistModel: {
    findOrCreate: jest.Mock;
    findAll: jest.Mock;
    findOne?: jest.Mock;
  };

  beforeEach(async () => {
    const mockMovieModel = {
      findByPk: jest.fn(),
    };

    const mockWatchlistModel = {
      findOrCreate: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(), // Ensure this is initialized here
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieWatchlistService,
        {
          provide: getModelToken(Movie),
          useValue: mockMovieModel,
        },
        {
          provide: getModelToken(MovieWatchlist),
          useValue: mockWatchlistModel,
        },
      ],
    }).compile();

    service = module.get<MovieWatchlistService>(MovieWatchlistService);
    movieModel = module.get(getModelToken(Movie));
    watchlistModel = module.get(getModelToken(MovieWatchlist));
  });

  describe('addToWatchlist', () => {
    it('should add a movie to the watchlist', async () => {
      const mockMovie = createMockInstance<Movie>({
        id: 1,
        title: 'Test Movie',
      });

      const mockWatchlistEntry = createMockInstance<MovieWatchlist>({
        userId: 'user1',
        movieId: 1,
      });

      movieModel.findByPk.mockResolvedValue(mockMovie);
      watchlistModel.findOrCreate.mockResolvedValue([mockWatchlistEntry, true]);

      const result = await service.addToWatchlist({
        userId: 'user1',
        movieId: 1,
      });

      expect(result).toEqual({ message: 'Movie added to watchlist' });
      expect(watchlistModel.findOrCreate).toHaveBeenCalledWith({
        where: { userId: 'user1', movieId: 1 },
        defaults: { isInWatchlist: true },
      });
    });
  });

  describe('getWatchlist', () => {
    it('should return watchlist items', async () => {
      const mockMovie = createMockInstance<Movie>({
        id: 1,
        title: 'Test Movie',
        overview: 'A great movie',
        vote_average: 8.5,
      });

      const mockWatchlistItem = createMockInstance<MovieWatchlist>({
        userId: 'user1',
        movieId: 1,
        movie: mockMovie,
      });

      // Override .get() for the test to return an object with a 'movie' key
      mockWatchlistItem.get = () => ({ movie: mockMovie });

      watchlistModel.findAll.mockResolvedValue([mockWatchlistItem]);

      const result = await service.getWatchlist('user1');

      expect(result).toEqual([mockMovie.toJSON()]);
      expect(watchlistModel.findAll).toHaveBeenCalledWith({
        where: { userId: 'user1', isInWatchlist: true },
        include: [
          {
            model: Movie,
            attributes: ['id', 'title', 'overview', 'vote_average'],
          },
        ],
      });
    });
  });

  describe('removeFromWatchlist', () => {
    it('should remove a movie from the watchlist', async () => {
      const mockWatchlistEntry = createMockInstance<MovieWatchlist>({
        userId: 'user1',
        movieId: 1,
        isInWatchlist: true,
      });

      watchlistModel.findOne = jest.fn().mockResolvedValue(mockWatchlistEntry);

      const result = await service.removeFromWatchlist({
        userId: 'user1',
        movieId: 1,
      });

      expect(result).toEqual({ message: 'Movie removed from watchlist' });
      expect(mockWatchlistEntry.isInWatchlist).toBe(false);
      expect(mockWatchlistEntry.save).toHaveBeenCalled();
    });
  });
});
