import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
  });
  console.log("FAUT FAIRE LE SANITIZE, AUTH GUARD");
  app.use(
    cors({
      origin: 'https://localhost:8443', // Allow requests from this origin
    }),
  ); // Use the cors middleware
  app.useWebSocketAdapter(new WsAdapter(app)); // Use the WsAdapter
  await app.listen(3000);
}
bootstrap();
