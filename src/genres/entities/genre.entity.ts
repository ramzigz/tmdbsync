import {
  Column,
  Model,
  Table,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Movie } from 'src/movies/entities/movie.entity';
import { MovieGenre } from './movie-genre.entity';

@Table
export class Genre extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  // Many-to-many relationship with Movie
  @BelongsToMany(() => Movie, () => MovieGenre)
  movies: Movie[];
}
