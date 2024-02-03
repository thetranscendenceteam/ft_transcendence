import { Test, TestingModule } from '@nestjs/testing';
import { UsersInChatsResolver } from './users-in-chats.resolver';

describe('UsersInChatsResolver', () => {
  let resolver: UsersInChatsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersInChatsResolver],
    }).compile();

    resolver = module.get<UsersInChatsResolver>(UsersInChatsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
