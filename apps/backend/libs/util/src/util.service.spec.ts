import { Test, TestingModule } from '@nestjs/testing';
import { UtilService } from './util.service';

describe('UtilService', () => {
  let service: UtilService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilService],
    }).compile();

    service = module.get<UtilService>(UtilService);
  });

  it('서비스가 정의되어 있어야 합니다', () => {
    expect(service).toBeDefined();
  });

  describe('sleep', () => {
    it('지정된 시간만큼 대기해야 합니다', async () => {
      const startTime = Date.now();
      await service.sleep(100);
      const endTime = Date.now();
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
    });

    it('0ms를 지정하면 즉시 resolve되어야 합니다', async () => {
      const startTime = Date.now();
      await service.sleep(0);
      const endTime = Date.now();
      // Process scheduling might cause a slight delay, so check if it's very small
      expect(endTime - startTime).toBeLessThan(20);
    });
  });
});
