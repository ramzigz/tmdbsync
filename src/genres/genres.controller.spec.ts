import { Test, TestingModule } from '@nestjs/testing';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';
import { Genre } from './entities/genre.entity';

describe('GenresController', () => {
  let controller: GenresController;
  let service: GenresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [
        {
          provide: GenresService,
          useValue: {
            findAll: jest.fn(), // Mock the 'findAll' method
          },
        },
      ],
    }).compile();

    controller = module.get<GenresController>(GenresController);
    service = module.get<GenresService>(GenresService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /genres', () => {
    it('should return an array of genres', async () => {
      const mockGenres = [
        { id: 1, name: 'Action' },
        { id: 2, name: 'Comedy' },
      ] as Genre[];

      // Use an arrow function for the spy to avoid issues with `this`
      const findAllSpy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValue(mockGenres);

      const result = await controller.findAll();

      expect(result).toEqual(mockGenres); // Verify the response matches the mock data
      expect(findAllSpy).toHaveBeenCalled(); // Verify that the service method was called
    });
  });
});
