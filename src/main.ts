import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('TMDBSync API')
    .setDescription(
      'A CRUD application that interacts with the TMDB API and provides an end-to-end solution for managing movie data',
    )
    .setVersion('1.0')
    .addTag('tmdbsync')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, documentFactory);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap().catch((error) => {
  console.error('Error during application bootstrap:', error);
});
