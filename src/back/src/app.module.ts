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
import { RelationshipModule } from './relationship/relationship.module';
import { GameGateway } from './game/game.gateway';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
        secret: process.env.JWT_PRIVATE_KEY,
        signOptions: {
            expiresIn: 3600,
        },
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (
        configService: ConfigService,
      ) => ({
        autoSchemaFile: 'schema.gql',
        installSubscriptionHandlers: true,
        subscriptions: { 'graphql-ws': true, 'subscriptions-transport-ws': false, },
      }),
    }),
    ChatModule,
    UserModule,
    UsersInChatsModule,
    AuthModule,
    MatchModule,
    MessagesModule,
    PubSubModule,
    RelationshipModule,
  ],
  controllers: [AppController],
  providers: [AppService, GameGateway, JwtStrategy],
})
export class AppModule {}
