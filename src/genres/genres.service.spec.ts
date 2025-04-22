import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { Genre } from './entities/genre.entity';
import { getModelToken } from '@nestjs/sequelize';

describe('GenresService', () => {
  let service: GenresService;
  let mockGenreModel: {
    findAll: jest.Mock;
  };

  beforeEach(async () => {
    // Create a complete mock that matches Sequelize model structure
    mockGenreModel = {
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: getModelToken(Genre),
          useValue: mockGenreModel,
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of genres', async () => {
      const mockGenres = [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Comedy' },
      ];
      mockGenreModel.findAll.mockResolvedValue(mockGenres);

      const result = await service.findAll();

      expect(result).toEqual(mockGenres);
      expect(mockGenreModel.findAll).toHaveBeenCalled();
    });

    it('should handle empty results', async () => {
      mockGenreModel.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });
});
