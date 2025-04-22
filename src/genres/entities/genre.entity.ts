import { Column, Model, Table, DataType } from 'sequelize-typescript';

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
}
