import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Genre } from './entities/genre.entity';

@Injectable()
export class GenresService {
  constructor(
    @InjectModel(Genre)
    private genreModel: typeof Genre,
  ) {}

  async findAll() {
    return this.genreModel.findAll();
  }

  async findOne(id: number) {
    return this.genreModel.findByPk(id);
  }
}
