import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors()
  }

  await app.listen(3000);
}
bootstrap();
