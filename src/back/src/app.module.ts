import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ChatModule } from './chat/chat.module';
import { UsersInChatsModule } from './users-in-chats/users-in-chats.module';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MatchModule } from './match/match.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    ChatModule,
    UserModule,
    UsersInChatsModule,
    AuthModule,
    MatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
