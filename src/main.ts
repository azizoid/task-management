import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['warn', 'error']
  });

  app.setGlobalPrefix('v1');

  if (process.env.NODE_ENV === 'development') {
    app.enableCors()
  }

  await app.listen(3000);
}
bootstrap();
