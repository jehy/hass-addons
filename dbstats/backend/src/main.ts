import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import configProvider from './config';
import { version } from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('addon-api');
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ extended: true, limit: '5mb' }));
  const config = new DocumentBuilder()
    .setTitle('dbstats API')
    .setDescription('dbstats API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  await app.listen(configProvider().server.port);
  const logger = new Logger('bootstrap');
  logger.log(
    `DBStats version ${version} started on port ${
      configProvider().server.port
    }`,
  );
  if (process.env.SUPERVISOR_TOKEN) {
    logger.log(`Wow, we're running on supervisor!`);
  } else {
    logger.log(`Not running on supervisor, okay`);
  }
}
bootstrap();
