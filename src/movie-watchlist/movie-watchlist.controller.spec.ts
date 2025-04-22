import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { MovieWatchlistController } from './movie-watchlist.controller';
import { MovieWatchlistService } from './movie-watchlist.service';
import { MovieWatchlistDto } from './dto/movie-watchlist.dto';

describe('MovieWatchlistController', () => {
  let controller: MovieWatchlistController;
  let service: {
    addToWatchlist: jest.Mock;
    getWatchlist: jest.Mock;
    removeFromWatchlist: jest.Mock;
  };

  beforeEach(async () => {
    const mockService = {
      addToWatchlist: jest.fn(),
      getWatchlist: jest.fn(),
      removeFromWatchlist: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieWatchlistController],
      providers: [
        {
          provide: MovieWatchlistService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<MovieWatchlistController>(MovieWatchlistController);
    service = module.get(MovieWatchlistService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /watchlist', () => {
    it('should add a movie to the watchlist', async () => {
      const mockResult = {
        id: 1,
        userId: '1',
        movieId: 101,
        addedAt: new Date(),
      };

      const dto: MovieWatchlistDto = {
        userId: '1',
        movieId: 101,
      };

      service.addToWatchlist.mockResolvedValue(mockResult);

      const result = await controller.addToWatchlist(dto);

      expect(result).toEqual(mockResult);
      expect(service.addToWatchlist).toHaveBeenCalledWith(dto);
    });

    it('should throw BadRequestException if the movie is already in the watchlist', async () => {
      service.addToWatchlist.mockRejectedValue(new BadRequestException());

      const dto: MovieWatchlistDto = { userId: '1', movieId: 101 };

      await expect(controller.addToWatchlist(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('GET /watchlist/:userId', () => {
    it("should return the user's watchlist", async () => {
      const mockWatchlist = [
        { id: 1, userId: '1', movieId: 101, addedAt: new Date() },
        { id: 2, userId: '1', movieId: 102, addedAt: new Date() },
      ];

      service.getWatchlist.mockResolvedValue(mockWatchlist);

      const result = await controller.getWatchlist('1');

      expect(result).toEqual(mockWatchlist);
      expect(service.getWatchlist).toHaveBeenCalledWith('1');
    });

    it('should return an empty array if the watchlist is empty', async () => {
      service.getWatchlist.mockResolvedValue([]);

      const result = await controller.getWatchlist('1');

      expect(result).toEqual([]);
    });
  });

  describe('DELETE /watchlist', () => {
    it('should remove a movie from the watchlist', async () => {
      const mockResult = { message: 'Movie removed from watchlist' };

      service.removeFromWatchlist.mockResolvedValue(mockResult);

      const dto: MovieWatchlistDto = { userId: 'user123', movieId: 101 };
      const result = await controller.removeFromWatchlist(dto);

      expect(result).toEqual(mockResult);
      expect(service.removeFromWatchlist).toHaveBeenCalledWith(dto);
    });

    it('should throw NotFoundException if the movie is not in the watchlist', async () => {
      service.removeFromWatchlist.mockRejectedValue(new NotFoundException());

      const dto: MovieWatchlistDto = { userId: 'user123', movieId: 999 };

      await expect(controller.removeFromWatchlist(dto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
