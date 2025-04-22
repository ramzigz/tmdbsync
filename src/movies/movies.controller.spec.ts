import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { FindAllMoviesDto } from './dto/find-movies.dto';
import { RateMovieDto } from './dto/rate-movie.dto';
import { NotFoundException } from '@nestjs/common';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [
        {
          provide: MoviesService,
          useValue: {
            findAll: jest.fn(),
            rateMovie: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /movies', () => {
    it('should return paginated movies with query parameters', async () => {
      const mockResult = {
        data: [
          {
            id: 1,
            title: 'Action Movie',
            adult: false,
            vote_average: 8.5,
            genres: [{ id: 1, name: 'Action' }],
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(mockResult);

      const query: FindAllMoviesDto = {
        page: 1,
        limit: 10,
        search: 'Action',
        adult: false,
        vote_average: 7.0,
        genres: '1',
      };

      const result = await controller.findAll(query);

      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(
        1,
        10,
        'Action',
        false,
        7.0,
        '1',
      );
    });
  });

  describe('POST /movies/:id/rate', () => {
    it('should rate a movie and return the updated average', async () => {
      const mockResult = {
        vote_average: 8.091,
        vote_count: 11,
      };

      jest.spyOn(service, 'rateMovie').mockResolvedValue(mockResult);

      const rateMovieDto: RateMovieDto = { rating: 9.0 };
      const result = await controller.rateMovie(1, rateMovieDto);

      expect(result).toEqual(mockResult);
      expect(service.rateMovie).toHaveBeenCalledWith(1, 9.0);
    });

    it('should throw NotFoundException if movie does not exist', async () => {
      jest
        .spyOn(service, 'rateMovie')
        .mockRejectedValue(new NotFoundException());

      const rateMovieDto: RateMovieDto = { rating: 9.0 };

      await expect(controller.rateMovie(999, rateMovieDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
