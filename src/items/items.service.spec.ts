import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { ConfigService } from '@nestjs/config';

describe('ItemsService', () => {
  let service: ItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: ConfigService,
          useValue: { get: () => null }, // on mock la config
        },
      ],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a new item', () => {
    const item = service.create({
      id: 'X1',
      name: 'École Test',
      latitude: 48.85,
      longitude: 2.35,
      type: 'ECOLE',
    });
    expect(item).toHaveProperty('id', 'X1');
    expect(item.favorite).toBe(false);
  });

  it('marks item as favorite', () => {
    service.create({
      id: 'X2',
      name: 'Collège Test',
      latitude: 48.86,
      longitude: 2.36,
      type: 'COLLEGE',
    });
    const updated = service.updateFavorite('X2', { favorite: true });
    expect(updated.favorite).toBe(true);
  });
});
