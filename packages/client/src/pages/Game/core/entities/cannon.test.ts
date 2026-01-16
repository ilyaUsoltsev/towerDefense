import Cannon from './cannon';
import { CannonsConfig, CannonType } from '../../constants/cannons-config';
import { GameConfig } from '../../constants/game-config';
import { Tile, Point } from '../utils/types';
import Enemy from './enemy';
import ProjectileManager from '../managers/projectileManager';
import { assetsManager } from '../managers/assetsManager';

// Мокаем ProjectileManager
jest.mock('../managers/projectileManager');
const MockProjectileManager = ProjectileManager as jest.MockedClass<
  typeof ProjectileManager
>;

// Мокаем assetsManager
jest.mock('../managers/assetsManager', () => ({
  assetsManager: {
    get: jest.fn(),
  },
}));

describe('Cannon', () => {
  let cannon: Cannon;
  let mockProjectileManager: jest.Mocked<ProjectileManager>;
  let mockContext: CanvasRenderingContext2D;
  const mockImage = {
    complete: true,
  } as HTMLImageElement;

  beforeEach(() => {
    // Создаем мок ProjectileManager
    mockProjectileManager = {
      createProjectile: jest.fn(),
    } as unknown as jest.Mocked<ProjectileManager>;

    MockProjectileManager.mockImplementation(() => mockProjectileManager);

    // Мокаем Canvas context
    mockContext = {
      drawImage: jest.fn(),
      strokeStyle: '',
      beginPath: jest.fn(),
      arc: jest.fn(),
      stroke: jest.fn(),
    } as unknown as CanvasRenderingContext2D;

    // Мокаем assetsManager.get
    (assetsManager.get as jest.Mock).mockReturnValue(mockImage);

    const position: Tile = { x: 2, y: 3, id: 'test' };
    cannon = new Cannon(position, 'basic', mockProjectileManager);
  });

  describe('Создание пушки', () => {
    test('должен создаваться с правильными параметрами из конфига', () => {
      const config = CannonsConfig.basic;

      expect(cannon.position).toEqual({ x: 2, y: 3, id: 'test' });
      expect(cannon.range).toBe(config.range);
      expect(cannon.damage).toBe(config.damage);
      expect(cannon.fireRate).toBe(config.fireRate);
      expect(cannon.cost).toBe(config.cost);
      expect(cannon.projectileSpeed).toBe(config.projectileSpeed);
      expect(cannon.explosionRadius).toBe(config.explosionRadius);
      expect(cannon.upgradeCost).toBe(config.upgradeCost);
      expect(cannon.level).toBe(1);
      expect(cannon.cannonType).toBe('basic');
    });

    test('должен иметь уникальный id', () => {
      const position: Tile = { x: 1, y: 1 };
      const cannon1 = new Cannon(position, 'basic', mockProjectileManager);
      const cannon2 = new Cannon(position, 'basic', mockProjectileManager);

      expect(cannon1.id).not.toBe(cannon2.id);
    });
  });

  describe('upgrade', () => {
    test('должен увеличивать уровень на 1', () => {
      const initialLevel = cannon.level;
      cannon.upgrade();

      expect(cannon.level).toBe(initialLevel + 1);
    });

    test('должен увеличивать damage на 20%', () => {
      const initialDamage = cannon.damage;
      cannon.upgrade();

      expect(cannon.damage).toBe(Math.floor(initialDamage * 1.2));
    });

    test('должен увеличивать range на 10%', () => {
      const initialRange = cannon.range;
      cannon.upgrade();

      expect(cannon.range).toBe(Math.floor(initialRange * 1.1));
    });

    test('должен уменьшать fireRate на 10%', () => {
      const initialFireRate = cannon.fireRate;
      cannon.upgrade();

      expect(cannon.fireRate).toBe(initialFireRate / 1.1);
    });

    test('должен увеличивать projectileSpeed на 10%', () => {
      const initialSpeed = cannon.projectileSpeed;
      cannon.upgrade();

      expect(cannon.projectileSpeed).toBe(initialSpeed * 1.1);
    });

    test('должен правильно применять несколько улучшений', () => {
      const initialDamage = cannon.damage;
      const initialRange = cannon.range;

      cannon.upgrade();
      const damageAfterFirst = cannon.damage;
      const rangeAfterFirst = cannon.range;

      cannon.upgrade();
      const damageAfterSecond = cannon.damage;
      const rangeAfterSecond = cannon.range;

      expect(damageAfterFirst).toBe(Math.floor(initialDamage * 1.2));
      expect(damageAfterSecond).toBe(Math.floor(damageAfterFirst * 1.2));
      expect(rangeAfterFirst).toBe(Math.floor(initialRange * 1.1));
      expect(rangeAfterSecond).toBe(Math.floor(rangeAfterFirst * 1.1));
      expect(cannon.level).toBe(3);
    });
  });

  describe('getSellValue', () => {
    test('должен рассчитывать стоимость продажи как cost * sellValue * level', () => {
      const expectedValue = Math.floor(
        cannon.cost * GameConfig.sellValue * cannon.level
      );
      expect(cannon.getSellValue()).toBe(expectedValue);
    });

    test('должен увеличивать стоимость продажи с уровнем', () => {
      const valueLevel1 = cannon.getSellValue();
      cannon.upgrade();
      const valueLevel2 = cannon.getSellValue();

      expect(valueLevel2).toBeGreaterThan(valueLevel1);
    });
  });

  describe('getUpgradeCost', () => {
    test('должен рассчитывать стоимость улучшения как upgradeCost * level', () => {
      const expectedCost = Math.floor(cannon.upgradeCost * cannon.level);
      expect(cannon.getUpgradeCost()).toBe(expectedCost);
    });

    test('должен увеличивать стоимость улучшения с уровнем', () => {
      const costLevel1 = cannon.getUpgradeCost();
      cannon.upgrade();
      const costLevel2 = cannon.getUpgradeCost();

      expect(costLevel2).toBeGreaterThan(costLevel1);
    });
  });

  describe('getCenter', () => {
    test('должен возвращать центр пушки на тайле', () => {
      const position: Tile = { x: 5, y: 7 };
      const cannon = new Cannon(position, 'basic', mockProjectileManager);
      const center = cannon.getCenter();

      const expectedX =
        position.x * GameConfig.tileSize + GameConfig.tileSize / 2;
      const expectedY =
        position.y * GameConfig.tileSize + GameConfig.tileSize / 2;

      expect(center).toEqual({ x: expectedX, y: expectedY });
    });
  });

  describe('isEnemyInRange', () => {
    test('должен возвращать true когда враг в радиусе', () => {
      const enemy = createMockEnemy({ x: 100, y: 100 });
      const cannon = createCannonAtPosition({ x: 0, y: 0 }, 'basic');

      // Расстояние примерно 141, range = 60, но range^2 = 3600
      // Расстояние^2 = 20000, что больше 3600, так что false
      // Создадим врага ближе
      const closeEnemy = createMockEnemy({ x: 50, y: 50 });
      expect(cannon.isEnemyInRange(closeEnemy)).toBe(true);
    });

    test('должен возвращать false когда враг вне радиуса', () => {
      const enemy = createMockEnemy({ x: 1000, y: 1000 });
      const cannon = createCannonAtPosition({ x: 0, y: 0 }, 'basic');

      expect(cannon.isEnemyInRange(enemy)).toBe(false);
    });

    test('должен учитывать увеличение радиуса после upgrade', () => {
      const enemy = createMockEnemy({ x: 80, y: 80 });
      const cannon = createCannonAtPosition({ x: 0, y: 0 }, 'basic');

      const inRangeBefore = cannon.isEnemyInRange(enemy);
      cannon.upgrade(); // Увеличивает range на 10%
      const inRangeAfter = cannon.isEnemyInRange(enemy);

      // Если враг был на границе, после upgrade он должен быть в радиусе
      expect(cannon.range).toBeGreaterThan(CannonsConfig.basic.range);
    });
  });

  describe('canFire', () => {
    test('должен возвращать true когда прошло достаточно времени', () => {
      const currentTime = 2000; // 2 секунды
      cannon.lastFireTime = 0; // Последний выстрел был в 0

      expect(cannon.canFire(currentTime)).toBe(true);
    });

    test('должен возвращать false когда прошло недостаточно времени', () => {
      const currentTime = 1000;
      cannon.lastFireTime = 500; // Прошло только 500мс, нужно 1500мс для basic

      expect(cannon.canFire(currentTime)).toBe(false);
    });

    test('должен учитывать fireRate после upgrade', () => {
      cannon.upgrade(); // Уменьшает fireRate (1500 / 1.1 ≈ 1363.64)
      const newFireRate = cannon.fireRate;

      // Устанавливаем время больше нового fireRate
      const currentTime = newFireRate + 100;
      cannon.lastFireTime = 0;

      // После upgrade fireRate меньше, так что должно быть true
      expect(cannon.canFire(currentTime)).toBe(true);
    });
  });

  describe('shootAt', () => {
    test('должен создавать снаряд через ProjectileManager', () => {
      const target: Point = { x: 100, y: 100 };
      const currentTime = 2000;
      cannon.lastFireTime = 0;

      cannon.shootAt(target, currentTime);

      expect(mockProjectileManager.createProjectile).toHaveBeenCalledTimes(1);
      const callArgs = mockProjectileManager.createProjectile.mock.calls[0];
      expect(callArgs[0]).toEqual(cannon.getCenter()); // start position
      expect(callArgs[1]).toEqual(target); // target position
      expect(callArgs[2]).toBe(cannon); // cannon reference
    });

    test('должен обновлять lastFireTime', () => {
      const target: Point = { x: 100, y: 100 };
      const currentTime = 2000;
      cannon.lastFireTime = 0;

      cannon.shootAt(target, currentTime);

      expect(cannon.lastFireTime).toBe(currentTime);
    });

    test('не должен стрелять если canFire возвращает false', () => {
      const target: Point = { x: 100, y: 100 };
      const currentTime = 1000;
      cannon.lastFireTime = 500; // Не прошло достаточно времени

      cannon.shootAt(target, currentTime);

      expect(mockProjectileManager.createProjectile).not.toHaveBeenCalled();
      expect(cannon.lastFireTime).toBe(500); // Не изменилось
    });
  });

  describe('update', () => {
    test('должен стрелять в ближайшего врага в радиусе', () => {
      // Создаем пушку в позиции (0, 0) для простоты расчетов
      const cannonPosition: Tile = { x: 0, y: 0 };
      const testCannon = new Cannon(
        cannonPosition,
        'basic',
        mockProjectileManager
      );
      testCannon.lastFireTime = 0;
      const currentTime = 2000;

      // Пушка basic имеет range = 60, центр будет в (16, 16)
      // Враг на позиции (50, 50) - расстояние ≈ 48, что меньше 60, так что в радиусе
      const cannonCenter = testCannon.getCenter();
      const enemyInRange = createMockEnemy({
        x: cannonCenter.x + 30, // В пределах радиуса
        y: cannonCenter.y + 30,
      });
      const enemyOutOfRange = createMockEnemy({ x: 1000, y: 1000 });
      enemyInRange.hasReachedEnd = jest.fn().mockReturnValue(false);
      enemyOutOfRange.hasReachedEnd = jest.fn().mockReturnValue(false);

      testCannon.update([enemyInRange, enemyOutOfRange], currentTime);

      expect(mockProjectileManager.createProjectile).toHaveBeenCalledTimes(1);
    });

    test('не должен стрелять если враг достиг конца', () => {
      const currentTime = 2000;
      cannon.lastFireTime = 0;

      const enemy = createMockEnemy({ x: 50, y: 50 });
      enemy.hasReachedEnd = jest.fn().mockReturnValue(true);

      cannon.update([enemy], currentTime);

      expect(mockProjectileManager.createProjectile).not.toHaveBeenCalled();
    });

    test('не должен стрелять если нет врагов в радиусе', () => {
      const currentTime = 2000;
      cannon.lastFireTime = 0;

      const enemy = createMockEnemy({ x: 1000, y: 1000 });
      enemy.hasReachedEnd = jest.fn().mockReturnValue(false);

      cannon.update([enemy], currentTime);

      expect(mockProjectileManager.createProjectile).not.toHaveBeenCalled();
    });

    test('не должен стрелять если canFire возвращает false', () => {
      const currentTime = 1000;
      cannon.lastFireTime = 500; // Не прошло достаточно времени

      const enemy = createMockEnemy({ x: 50, y: 50 });
      enemy.hasReachedEnd = jest.fn().mockReturnValue(false);

      cannon.update([enemy], currentTime);

      expect(mockProjectileManager.createProjectile).not.toHaveBeenCalled();
    });
  });

  // Вспомогательные функции
  function createCannonAtPosition(position: Tile, type: CannonType): Cannon {
    return new Cannon(position, type, mockProjectileManager);
  }

  function createMockEnemy(position: Point): jest.Mocked<Enemy> {
    return {
      getPosition: jest.fn().mockReturnValue(position),
      hasReachedEnd: jest.fn().mockReturnValue(false),
    } as unknown as jest.Mocked<Enemy>;
  }
});
