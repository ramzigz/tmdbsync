import { Test, TestingModule } from '@nestjs/testing';
import { MovieWatchlistController } from './movie-watchlist.controller';
import { MovieWatchlistService } from './movie-watchlist.service';

describe('MovieWatchlistController', () => {
  let controller: MovieWatchlistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieWatchlistController],
      providers: [MovieWatchlistService],
    }).compile();

    controller = module.get<MovieWatchlistController>(MovieWatchlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
