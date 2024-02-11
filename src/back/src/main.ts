import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log("FAUT FAIRE LE SANITIZE, AUTH GUARD");
  app.use(
    cors({
      origin: 'https://localhost:8443', // Allow requests from this origin
    }),
  ); // Use the cors middleware
  await app.listen(3000);
}
bootstrap();