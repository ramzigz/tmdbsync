import {
  Column,
  Model,
  Table,
  DataType,
  BelongsToMany,
} from 'sequelize-typescript';
import { Genre } from 'src/genres/entities/genre.entity';
import { MovieGenre } from 'src/genres/entities/movie-genre.entity';

@Table
export class Movie extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  adult: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  original_language: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  original_title: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  overview: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  popularity: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  poster_path: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  release_date: Date;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  vote_average: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  vote_count: number;

  // @Column(DataType.ARRAY(DataType.INTEGER))
  // genres: number[];

  // Many-to-many relationship with Genre
  @BelongsToMany(() => Genre, () => MovieGenre)
  genres: Genre[];

  @Column({
    type: DataType.STRING,
  })
  backdrop_path: string;
}
