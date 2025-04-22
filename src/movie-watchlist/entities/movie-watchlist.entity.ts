import {
  Column,
  ForeignKey,
  Model,
  Table,
  BelongsTo,
} from 'sequelize-typescript';
import { Movie } from 'src/movies/entities/movie.entity';

@Table
export class MovieWatchlist extends Model {
  @Column({
    type: 'STRING',
    allowNull: false,
  })
  declare userId: string;

  @ForeignKey(() => Movie)
  @Column({
    type: 'INTEGER',
    allowNull: false,
  })
  declare movieId: number;

  @Column({
    type: 'BOOLEAN',
    defaultValue: false,
  })
  declare isInWatchlist: boolean;

  @BelongsTo(() => Movie)
  movie: Movie;
}
