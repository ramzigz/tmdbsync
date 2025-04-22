<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
  <a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
  <a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
  <a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
  <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>

## Description

A full-stack NestJS project that integrates with The Movie Database (TMDB) API to sync and manage movie data. It includes features like pagination, filtering, rating, and a personalized movie watchlist.

## Available Endpoints

### Health Check
- **GET** `/test-db`: Check the connection to the database.

### Movies
- **GET** `/movies`: Retrieve movies with optional filters like genres, vote average, adult content, search term, pagination.
- **POST** `/movies/{id}/rate`: Submit a rating for a movie.

### Genres
- **GET** `/genres`: Fetch all available genres.

### TMDB Sync
- **POST** `/tmdb/sync`: Sync movies and genres from TMDB API.

### Watchlist
- **POST** `/watchlist`: Add a movie to a user's watchlist.
- **GET** `/watchlist?userId=user123`: Get all movies in a user's watchlist.
- **DELETE** `/watchlist`: Remove a movie from the watchlist.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

For production deployment, refer to the [NestJS deployment guide](https://docs.nestjs.com/deployment).

You can also deploy using [Mau](https://mau.nestjs.com):

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Discord](https://discord.gg/G7Qnnhy)
- [Official Courses](https://courses.nestjs.com/)
- [NestJS Devtools](https://devtools.nestjs.com)


## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).