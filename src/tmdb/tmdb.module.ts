import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SequelizeModule } from '@nestjs/sequelize';
import { TmdbService } from './tmdb.service';
import { TmdbController } from './tmdb.controller';
import { Movie } from '../movies/entities/movie.entity';
import { Genre } from '../genres/entities/genre.entity';
import { MovieGenre } from 'src/genres/entities/movie-genre.entity';

@Module({
  imports: [HttpModule, SequelizeModule.forFeature([Movie, Genre, MovieGenre])],
  controllers: [TmdbController],
  providers: [TmdbService],
  exports: [TmdbService],
})
export class TmdbModule {}
