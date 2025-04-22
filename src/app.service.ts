import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';

@Injectable()
export class AppService {
  constructor(@InjectConnection() private sequelize) {}

  getHello(): string {
    return 'Hello World!';
  }

  async testDbConnection() {
    try {
      await this.sequelize.authenticate();
      return 'Database connection successful';
    } catch (error: unknown) {
      return {
        status: 'error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
