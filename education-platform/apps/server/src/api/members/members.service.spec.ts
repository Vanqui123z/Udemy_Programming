import { Test, TestingModule } from '@nestjs/testing';
import { MumbersService } from './members.service';

describe('MumbersService', () => {
  let service: MumbersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MumbersService],
    }).compile();

    service = module.get<MumbersService>(MumbersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
