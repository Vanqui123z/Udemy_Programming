import { Test, TestingModule } from '@nestjs/testing';
import { MumbersController } from './members.controller';

describe('MumbersController', () => {
  let controller: MumbersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MumbersController],
    }).compile();

    controller = module.get<MumbersController>(MumbersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
