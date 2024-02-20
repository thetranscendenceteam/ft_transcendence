import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { WsAdapter } from '@nestjs/platform-ws';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
  });
  app.use(
    cors({
      origin: 'https://localhost:8443', // Allow requests from this origin
    }),
  ); // Use the cors middleware
  app.useWebSocketAdapter(new WsAdapter(app)); // Use the WsAdapter
  app.use(cookieParser()); //Use cookie parser
  await app.listen(3000);
}
bootstrap();
