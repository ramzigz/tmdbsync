import { Test, TestingModule } from '@nestjs/testing';
import { TmdbService } from './tmdb.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Movie } from '../movies/entities/movie.entity';
import { Genre } from '../genres/entities/genre.entity';
import { getModelToken } from '@nestjs/sequelize';
import { of } from 'rxjs';
import { Model } from 'sequelize';

// Mock TMDB genre and movie responses
const mockGenresResponse = {
  genres: [
    { id: 1, name: 'Action' },
    { id: 2, name: 'Drama' },
  ],
};

const mockMoviesResponse = {
  results: [
    {
      id: 101,
      adult: false,
      original_language: 'en',
      original_title: 'Mock Movie',
      overview: 'A mock movie overview',
      popularity: 100,
      poster_path: '/mock.jpg',
      release_date: '2023-01-01',
      title: 'Mock Movie',
      vote_average: 8.5,
      vote_count: 1000,
      genre_ids: [1, 2],
    },
  ],
};

describe('TmdbService', () => {
  let service: TmdbService;
  let configService: { get: jest.Mock };
  let httpService: { get: jest.Mock };
  let movieModel: {
    upsert: jest.Mock;
    prototype: { $set: jest.Mock };
  };
  let genreModel: { upsert: jest.Mock };

  beforeEach(async () => {
    // Initialize mocks with proper typing
    configService = {
      get: jest.fn().mockReturnValue('mock-api-key'),
    };

    httpService = {
      get: jest.fn().mockReturnValue(of({ data: mockGenresResponse })),
    };

    genreModel = {
      upsert: jest.fn().mockImplementation((genre) => Promise.resolve(genre)),
    };

    movieModel = {
      upsert: jest
        .fn()
        .mockImplementation((movie) =>
          Promise.resolve([{ ...movie, $set: jest.fn() }]),
        ),
      prototype: {
        $set: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TmdbService,
        { provide: ConfigService, useValue: configService },
        { provide: HttpService, useValue: httpService },
        { provide: getModelToken(Movie), useValue: movieModel },
        { provide: getModelToken(Genre), useValue: genreModel },
      ],
    }).compile();

    service = module.get<TmdbService>(TmdbService);
  });

  describe('syncData', () => {
    it('should sync genres when "genres" is included', async () => {
      const response = await service.syncData('genres', 0);

      expect(genreModel.upsert).toHaveBeenCalledTimes(2);
      expect(genreModel.upsert).toHaveBeenCalledWith({ id: 1, name: 'Action' });
      expect(genreModel.upsert).toHaveBeenCalledWith({ id: 2, name: 'Drama' });
      expect(response.genres).toBe(2);
      expect(response.movies).toBe(0);
    });

    it('should sync movies when "movies" is included', async () => {
      httpService.get
        .mockReturnValueOnce(of({ data: mockGenresResponse }))
        .mockReturnValueOnce(of({ data: mockMoviesResponse }));

      const response = await service.syncData('movies', 1);

      expect(movieModel.upsert).toHaveBeenCalledTimes(1);
      expect(movieModel.upsert).toHaveBeenCalledWith({
        id: 101,
        adult: false,
        original_language: 'en',
        original_title: 'Mock Movie',
        overview: 'A mock movie overview',
        popularity: 100,
        poster_path: '/mock.jpg',
        release_date: new Date('2023-01-01'),
        title: 'Mock Movie',
        vote_average: 8.5,
        vote_count: 1000,
      });
      expect(response.genres).toBe(0);
      expect(response.movies).toBe(1);
    });

    it('should sync both genres and movies', async () => {
      httpService.get
        .mockReturnValueOnce(of({ data: mockGenresResponse }))
        .mockReturnValueOnce(of({ data: mockMoviesResponse }));

      const response = await service.syncData('genres,movies', 1);

      expect(genreModel.upsert).toHaveBeenCalledTimes(2);
      expect(movieModel.upsert).toHaveBeenCalledTimes(1);
      expect(response.genres).toBe(2);
      expect(response.movies).toBe(1);
    });

    it('should handle empty include parameter', async () => {
      const response = await service.syncData(undefined, 0);

      expect(genreModel.upsert).not.toHaveBeenCalled();
      expect(movieModel.upsert).not.toHaveBeenCalled();
      expect(response.genres).toBe(0);
      expect(response.movies).toBe(0);
    });

    it('should handle partial sync when numberOfMoviesToSync is less than a full page', async () => {
      const partialMoviesResponse = {
        results: [
          ...mockMoviesResponse.results,
          {
            id: 102,
            adult: false,
            original_language: 'en',
            original_title: 'Mock Movie 2',
            overview: 'Another mock movie overview',
            popularity: 90,
            poster_path: '/mock2.jpg',
            release_date: '2023-02-01',
            title: 'Mock Movie 2',
            vote_average: 7.5,
            vote_count: 800,
            genre_ids: [1],
          },
        ],
      };

      httpService.get
        .mockReturnValueOnce(of({ data: mockGenresResponse }))
        .mockReturnValueOnce(of({ data: partialMoviesResponse }));

      const response = await service.syncData('movies', 1);

      expect(movieModel.upsert).toHaveBeenCalledTimes(1);
      expect(response.movies).toBe(1);
    });
  });
});
