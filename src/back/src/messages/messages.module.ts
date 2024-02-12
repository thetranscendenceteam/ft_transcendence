import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MessagesResolver } from './messages.resolver';
import { MessagesService } from './messages.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
        ttl: 600
      }),
    }),
  ],
  providers: [MessagesResolver, MessagesService, PrismaService]
})
export class MessagesModule { }
