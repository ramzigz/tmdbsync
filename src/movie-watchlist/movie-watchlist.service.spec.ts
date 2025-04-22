import { Test, TestingModule } from '@nestjs/testing';
import { MovieWatchlistService } from './movie-watchlist.service';

describe('MovieWatchlistService', () => {
  let service: MovieWatchlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovieWatchlistService],
    }).compile();

    service = module.get<MovieWatchlistService>(MovieWatchlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
