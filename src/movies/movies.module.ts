import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie } from './entities/movie.entity';

@Module({
  imports: [SequelizeModule.forFeature([Movie])],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
