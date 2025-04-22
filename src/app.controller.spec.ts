import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getConnectionToken } from '@nestjs/sequelize';

describe('AppController', () => {
  let controller: AppController;
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: getConnectionToken(), // Provide the mocked Sequelize instance
          useValue: {
            authenticate: jest.fn(), // Mock the authenticate method
          },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    service = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /test-db', () => {
    it('should return "Database connection successful" when the service succeeds', async () => {
      // Spy on the testDbConnection method
      const testDbConnectionSpy = jest
        .spyOn(service, 'testDbConnection')
        .mockResolvedValue('Database connection successful');

      const result = await controller.testDbConnection();

      expect(result).toBe('Database connection successful');
      expect(testDbConnectionSpy).toHaveBeenCalled(); // Use the spy directly
    });

    it('should return an error object when the service fails', async () => {
      const mockErrorResult = {
        status: 'error',
        message: 'Database connection failed',
        error: 'Connection failed',
      };
      // Spy on the testDbConnection method
      const testDbConnectionSpy = jest
        .spyOn(service, 'testDbConnection')
        .mockResolvedValue(mockErrorResult);

      const result = await controller.testDbConnection();

      expect(result).toEqual(mockErrorResult);
      expect(testDbConnectionSpy).toHaveBeenCalled(); // Use the spy directly
    });
  });
});
