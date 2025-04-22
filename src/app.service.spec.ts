import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { Sequelize } from 'sequelize';
import { getConnectionToken } from '@nestjs/sequelize';

describe('AppService', () => {
  let service: AppService;
  let sequelize: Sequelize;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: getConnectionToken(),
          useValue: {
            authenticate: jest.fn(), // Mock the authenticate method
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    sequelize = module.get<Sequelize>(getConnectionToken());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('testDbConnection', () => {
    it('should return "Database connection successful" when authentication succeeds', async () => {
      // Spy on the authenticate method
      const authenticateSpy = jest
        .spyOn(sequelize, 'authenticate')
        .mockResolvedValue(undefined);

      const result = await service.testDbConnection();

      expect(result).toBe('Database connection successful');
      expect(authenticateSpy).toHaveBeenCalled(); // Use the spy directly
    });

    it('should return an error object when authentication fails', async () => {
      const mockError = new Error('Connection failed');
      // Spy on the authenticate method
      const authenticateSpy = jest
        .spyOn(sequelize, 'authenticate')
        .mockRejectedValue(mockError);

      const result = await service.testDbConnection();

      expect(result).toEqual({
        status: 'error',
        message: 'Database connection failed',
        error: mockError.message,
      });
      expect(authenticateSpy).toHaveBeenCalled(); // Use the spy directly
    });
  });
});
