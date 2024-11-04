import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger: Logger = new Logger('bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  
  const port: number = configService.get<number>('PORT');

  await app.listen(port, () => {
    logger.log('Application is running On URL:\n http://localhost:3000 ...');
  });
}

bootstrap();
