import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { Movie } from '../movies/entities/movie.entity';
import { Genre } from '../genres/entities/genre.entity';
import { InjectModel } from '@nestjs/sequelize';

interface TmdbGenre {
  id: number;
  name: string;
}

interface TmdbMovie {
  id: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

@Injectable()
export class TmdbService {
  private readonly logger = new Logger(TmdbService.name);
  private readonly baseUrl = 'https://api.themoviedb.org/3';

  // Rate limit configuration
  private readonly maxRequestsPerWindow = 40; // Allowed requests per time window
  private readonly timeWindowMs = 10 * 1000; // Time window in milliseconds (10 seconds)
  private lastRequestTimestamps: number[] = []; // Tracks timestamps of recent requests

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    @InjectModel(Movie)
    private movieModel: typeof Movie,
    @InjectModel(Genre)
    private genreModel: typeof Genre,
  ) {}

  private getApiKey(): string {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    if (!apiKey) {
      throw new Error('TMDB_API_KEY is not defined in environment variables');
    }
    return apiKey;
  }

  // Adds a delay to ensure the request rate does not exceed the limit.
  private async throttleRequest() {
    const now = Date.now();

    // Remove timestamps older than the current time window
    this.lastRequestTimestamps = this.lastRequestTimestamps.filter(
      (timestamp) => now - timestamp < this.timeWindowMs,
    );

    // If the number of requests in the current window exceeds the limit, wait
    if (this.lastRequestTimestamps.length >= this.maxRequestsPerWindow) {
      const oldestRequestTime =
        this.lastRequestTimestamps[0] || now - this.timeWindowMs;
      const waitTime = this.timeWindowMs - (now - oldestRequestTime);

      if (waitTime > 0) {
        this.logger.log(`Throttling request. Waiting for ${waitTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    // Record the current request timestamp
    this.lastRequestTimestamps.push(Date.now());
  }

  private async makeRequest<T>(
    endpoint: string,
    params: Record<string, any> = {},
  ): Promise<T> {
    try {
      await this.throttleRequest(); // Throttle before making the request

      const response = await firstValueFrom(
        this.httpService.get<T>(`${this.baseUrl}${endpoint}`, {
          params: {
            api_key: this.getApiKey(),
            ...params,
          },
        }),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError; // Explicitly type the error
      this.logger.error(`Error making request to TMDB: ${axiosError.message}`);
      throw error;
    }
  }

  async syncData(include: string | undefined, numberOfMoviesToSync: number) {
    try {
      const includes = include?.split(',').map((item) => item.trim()) || [];
      let genresSynced = 0;
      let moviesSynced = 0;

      if (includes.includes('genres')) {
        // Sync genres
        const { genres } = await this.makeRequest<{ genres: TmdbGenre[] }>(
          '/genre/movie/list',
        );

        for (const genre of genres) {
          await this.genreModel.upsert({
            id: genre.id,
            name: genre.name,
          });
        }

        genresSynced = genres.length;
        this.logger.log(`Successfully synced ${genresSynced} genres`);
      }

      if (includes.includes('movies')) {
        // Calculate the number of pages needed
        const itemsPerPage = 20; // TMDB returns 20 items per page
        const totalPages = Math.ceil(numberOfMoviesToSync / itemsPerPage);

        for (let page = 1; page <= totalPages; page++) {
          const { results }: { results: TmdbMovie[] } = await this.makeRequest<{
            results: TmdbMovie[];
          }>('/movie/popular', { page });

          // Limit the number of movies processed to avoid exceeding numberOfMoviesToSync
          const moviesToProcess =
            moviesSynced + results.length > numberOfMoviesToSync
              ? results.slice(0, numberOfMoviesToSync - moviesSynced)
              : results;

          for (const movie of moviesToProcess) {
            await this.movieModel.upsert({
              id: movie.id,
              adult: movie.adult,
              original_language: movie.original_language,
              original_title: movie.original_title,
              overview: movie.overview,
              popularity: movie.popularity,
              poster_path: movie.poster_path,
              release_date: new Date(movie.release_date),
              title: movie.title,
              vote_average: movie.vote_average,
              vote_count: movie.vote_count,
              genres: movie.genre_ids,
            });
          }

          moviesSynced += moviesToProcess.length;

          this.logger.log(
            `Synced ${moviesToProcess.length} movies from page ${page}`,
          );

          // Stop early if we've synced enough movies
          if (moviesSynced >= numberOfMoviesToSync) {
            break;
          }
        }

        this.logger.log(`Successfully synced ${moviesSynced} movies`);
      }

      return {
        genres: genresSynced,
        movies: moviesSynced,
      };
    } catch (error) {
      const axiosError = error as AxiosError; // Explicitly type the error
      this.logger.error(`Error syncing data: ${axiosError.message}`);
      throw error;
    }
  }
}
