import { Test, TestingModule } from '@nestjs/testing';
import { UsersInChatsService } from './users-in-chats.service';

describe('UsersInChatsService', () => {
  let service: UsersInChatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersInChatsService],
    }).compile();

    service = module.get<UsersInChatsService>(UsersInChatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
