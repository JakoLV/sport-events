import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
import { ResponseInterceptor } from './response.interceptor';
import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const httpsOptions = {
    key: readFileSync(__dirname + '/../server.key'),
    cert: readFileSync(__dirname + '/../server.crt'),
  };

  const app = await NestFactory.create(AppModule, { httpsOptions });
  app.enableCors();
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
