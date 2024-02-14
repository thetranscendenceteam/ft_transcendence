import { Test, TestingModule } from '@nestjs/testing';
import { RelationshipResolver } from './relationship.resolver';

describe('RelationshipResolver', () => {
  let resolver: RelationshipResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelationshipResolver],
    }).compile();

    resolver = module.get<RelationshipResolver>(RelationshipResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
