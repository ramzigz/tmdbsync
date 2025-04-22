import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize'; // Import the Sequelize type

@Injectable()
export class AppService {
  constructor(@InjectConnection() private sequelize: Sequelize) {} // Explicitly type sequelize

  async testDbConnection() {
    try {
      await this.sequelize.authenticate(); // Use the typed sequelize instance
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
