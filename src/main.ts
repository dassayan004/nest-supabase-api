import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { APP_TITLE, AppLogger, ConfigSchema } from '~/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new AppLogger(APP_TITLE),
  });
  const configService = app.get(ConfigService<ConfigSchema, true>);

  const port = configService.getOrThrow<number>('PORT');
  const baseUrl = configService.getOrThrow<string>('BASE_URL');
  const env = configService.getOrThrow<string>('NODE_ENV');

  // swagger openapi
  const swaggerPrefix = 'swagger';
  const config = new DocumentBuilder()
    .setTitle(APP_TITLE)
    .setDescription('API')
    .setVersion(env.toUpperCase())
    .addServer(baseUrl)
    .setExternalDoc('Postman Collection', `${swaggerPrefix}/json`)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerPrefix, app, document, {
    jsonDocumentUrl: `${swaggerPrefix}/json`,
  });

  // Middleware
  app.enableCors({
    origin: ['*'],
  });
  app.enableShutdownHooks();

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(port);
  Logger.log(`🚀 Application is running on: ${baseUrl}`);
  Logger.log(`🌎 Swagger is running on: ${baseUrl}/${swaggerPrefix}`);
}
bootstrap();
