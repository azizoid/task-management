import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'error']
  });

  app.setGlobalPrefix('v1');
  app.enableCors()

  // if (process.env.NODE_ENV === 'development') {
  //   app.enableCors()
  // }

  await app.listen(3000);
}
bootstrap();
