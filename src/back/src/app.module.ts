import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ChatModule } from './chat/chat.module';
import { UsersInChatsModule } from './users-in-chats/users-in-chats.module';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MatchModule } from './match/match.module';
import { MessagesModule } from './messages/messages.module';
import { PubSubModule } from './pubsub/pubsub.module';
import * as Joi from '@hapi/joi';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      })
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ) => ({
        autoSchemaFile: 'schema.gql',
        installSubscriptionHandlers: true
      })
    }),
    ChatModule,
    UserModule,
    UsersInChatsModule,
    AuthModule,
    MatchModule,
    MessagesModule,
    PubSubModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
