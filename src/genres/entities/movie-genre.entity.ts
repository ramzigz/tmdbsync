import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Movie } from 'src/movies/entities/movie.entity';
import { Genre } from './genre.entity';

@Table
export class MovieGenre extends Model {
  @ForeignKey(() => Movie)
  @Column
  movieId: number;

  @ForeignKey(() => Genre)
  @Column
  genreId: number;
}
