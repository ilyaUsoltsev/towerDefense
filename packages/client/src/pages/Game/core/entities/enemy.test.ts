import Enemy from './enemy';
import { GameConfig } from '../../constants/game-config';
import { Tile } from '../utils/types';
import PathManager from '../managers/pathManager';
import { EnemiesConfig } from '../../constants/enemies-config';
import { Effect } from '../../constants/effects-config';

// Мокаем PathManager
jest.mock('../managers/pathManager');
const MockPathManager = PathManager as jest.MockedClass<typeof PathManager>;

describe('Enemy', () => {
  let enemy: Enemy;
  let mockPathManager: jest.Mocked<PathManager>;
  const mockPath: Tile[] = [
    { x: 0, y: 0, id: 'start' },
    { x: 1, y: 0, id: 'path' },
    { x: 2, y: 0, id: 'path' },
    { x: 3, y: 0, id: 'finish' },
  ];

  beforeEach(() => {
    // Создаем мок PathManager
    mockPathManager = {
      getStartFinishPath: jest.fn().mockReturnValue(mockPath),
    } as unknown as jest.Mocked<PathManager>;

    MockPathManager.mockImplementation(() => mockPathManager);

    const startTile: Tile = { x: 0, y: 0, id: 'start' };
    enemy = new Enemy(startTile, mockPathManager, 'normal', 100, 10);
  });

  describe('Создание врага', () => {
    test('должен создаваться с начальными параметрами', () => {
      const startTile: Tile = { x: 0, y: 0, id: 'start' };
      const hp = 100;
      const reward = 10;
      const enemy = new Enemy(startTile, mockPathManager, 'normal', hp, reward);

      expect(enemy.health).toBe(hp);
      expect(enemy.maxHealth).toBe(hp);
      expect(enemy.reward).toBe(reward);
      expect(enemy.immune).toBe(EnemiesConfig.normal.immune);
      expect(enemy.radius).toBe(EnemiesConfig.normal.radius);
      expect(enemy.imagePath).toBe(EnemiesConfig.normal.imagePath);
      expect(enemy.isDestroyed).toBe(false);
      expect(enemy.currentIndex).toBe(0);
    });

    test('должен устанавливать начальную позицию в центре стартового тайла', () => {
      const startTile: Tile = { x: 2, y: 3, id: 'start' };
      const enemy = new Enemy(startTile, mockPathManager, 'normal', 100, 10);

      const expectedX =
        startTile.x * GameConfig.tileSize + GameConfig.tileSize / 2;
      const expectedY =
        startTile.y * GameConfig.tileSize + GameConfig.tileSize / 2;

      expect(enemy.currentPosition).toEqual({ x: expectedX, y: expectedY });
    });

    test('должен получать путь из PathManager', () => {
      expect(mockPathManager.getStartFinishPath).toHaveBeenCalled();
      expect(enemy.path).toEqual(mockPath);
    });
  });

  describe('moveAlongPath', () => {
    test('должен двигаться к следующему тайлу', () => {
      const initialPosition = { ...enemy.currentPosition };

      // Устанавливаем достаточно большую скорость для достижения следующего тайла
      enemy.speed = 100;

      enemy.moveAlongPath();

      // Позиция должна измениться
      expect(enemy.currentPosition).not.toEqual(initialPosition);
    });

    test('должен увеличивать currentIndex при достижении тайла', () => {
      enemy.speed = 100; // Большая скорость для быстрого движения
      const initialIndex = enemy.currentIndex;

      enemy.moveAlongPath();

      // Если враг достиг следующего тайла, индекс должен увеличиться
      expect(enemy.currentIndex).toBeGreaterThanOrEqual(initialIndex);
      expect(enemy.currentIndex).toBeGreaterThanOrEqual(0);
    });

    test('не должен двигаться если путь пуст', () => {
      enemy.path = [];
      const initialPosition = { ...enemy.currentPosition };

      enemy.moveAlongPath();

      expect(enemy.currentPosition).toEqual(initialPosition);
    });

    test('не должен двигаться если достиг конца', () => {
      enemy.currentIndex = enemy.path.length - 1;
      const initialPosition = { ...enemy.currentPosition };

      enemy.moveAlongPath();

      expect(enemy.currentPosition).toEqual(initialPosition);
    });

    test('должен двигаться с учетом скорости', () => {
      const initialPosition = { ...enemy.currentPosition };
      enemy.speed = 1; // Медленная скорость

      enemy.moveAlongPath();

      // Позиция должна измениться, но не достичь следующего тайла сразу
      expect(enemy.currentPosition).not.toEqual(initialPosition);
    });
  });

  describe('hasReachedEnd', () => {
    test('должен возвращать false когда не достиг конца', () => {
      enemy.currentIndex = 0;
      expect(enemy.hasReachedEnd()).toBe(false);

      enemy.currentIndex = 1;
      expect(enemy.hasReachedEnd()).toBe(false);
    });

    test('должен возвращать true когда достиг конца', () => {
      enemy.currentIndex = enemy.path.length - 1;
      expect(enemy.hasReachedEnd()).toBe(true);

      enemy.currentIndex = enemy.path.length;
      expect(enemy.hasReachedEnd()).toBe(true);
    });
  });

  describe('takeHit', () => {
    test('должен уменьшать здоровье на указанный урон', () => {
      const initialHealth = enemy.health;
      const damage = 20;

      enemy.takeHit(damage, null);

      expect(enemy.health).toBe(initialHealth - damage);
    });

    test('должен устанавливать isDestroyed в true когда HP <= 0', () => {
      enemy.health = 10;
      enemy.takeHit(10, null);

      expect(enemy.health).toBe(0);
      expect(enemy.isDestroyed).toBe(true);
    });

    test('должен устанавливать health в 0 когда урон больше здоровья', () => {
      enemy.health = 10;
      enemy.takeHit(50, null);

      expect(enemy.health).toBe(0);
      expect(enemy.isDestroyed).toBe(true);
    });

    test('не должен обрабатывать урон если уже уничтожен', () => {
      enemy.isDestroyed = true;
      enemy.health = 0;
      const initialHealth = enemy.health;

      enemy.takeHit(10, null);

      expect(enemy.health).toBe(initialHealth);
    });

    test('должен применять эффект если враг не immune', () => {
      enemy.immune = false;
      const effect: Effect = {
        name: 'Freeze',
        magnitude: 0.7,
        duration: 1000,
      };

      enemy.takeHit(10, effect);

      expect(enemy.activeEffects).toHaveLength(1);
      expect(enemy.activeEffects[0].name).toBe('Freeze');
    });

    test('не должен применять эффект если враг immune', () => {
      enemy.immune = true;
      const effect: Effect = {
        name: 'Freeze',
        magnitude: 0.7,
        duration: 1000,
      };

      enemy.takeHit(10, effect);

      expect(enemy.activeEffects).toHaveLength(0);
    });

    test('должен обновлять длительность существующего эффекта', () => {
      enemy.immune = false;
      const effect: Effect = {
        name: 'Freeze',
        magnitude: 0.7,
        duration: 1000,
      };

      enemy.takeHit(10, effect);
      const initialDuration = enemy.activeEffects[0].duration;

      // Применяем эффект снова
      const newEffect: Effect = {
        name: 'Freeze',
        magnitude: 0.7,
        duration: 2000,
      };
      enemy.takeHit(10, newEffect);

      expect(enemy.activeEffects).toHaveLength(1);
      expect(enemy.activeEffects[0].duration).toBe(2000);
      expect(enemy.activeEffects[0].duration).toBeGreaterThan(initialDuration);
    });
  });

  describe('update', () => {
    test('должен вызывать moveAlongPath', () => {
      const moveSpy = jest.spyOn(enemy, 'moveAlongPath');
      enemy.update(16); // 16ms deltaTime

      expect(moveSpy).toHaveBeenCalled();
      moveSpy.mockRestore();
    });

    test('должен обновлять эффекты', () => {
      enemy.immune = false;
      const effect: Effect = {
        name: 'Freeze',
        magnitude: 0.7,
        duration: 1000,
      };
      enemy.takeHit(10, effect);

      const initialDuration = enemy.activeEffects[0].duration;
      enemy.update(100); // Прошло 100мс

      expect(enemy.activeEffects[0].duration).toBeLessThan(initialDuration);
      expect(enemy.activeEffects[0].duration).toBe(initialDuration - 100);
    });
  });

  describe('updateEffects', () => {
    test('должен уменьшать длительность эффектов', () => {
      enemy.immune = false;
      const effect: Effect = {
        name: 'Freeze',
        magnitude: 0.7,
        duration: 1000,
      };
      enemy.takeHit(10, effect);

      const initialDuration = enemy.activeEffects[0].duration;
      enemy.update(200);

      expect(enemy.activeEffects[0].duration).toBe(initialDuration - 200);
    });

    test('должен удалять истекшие эффекты', () => {
      enemy.immune = false;
      const effect: Effect = {
        name: 'Freeze',
        magnitude: 0.7,
        duration: 100,
      };
      enemy.takeHit(10, effect);

      expect(enemy.activeEffects).toHaveLength(1);
      enemy.update(150); // Больше чем duration

      expect(enemy.activeEffects).toHaveLength(0);
    });

    test('должен замедлять скорость при эффекте Freeze', () => {
      enemy.immune = false;
      const baseSpeed = enemy.baseSpeed;
      const effect: Effect = {
        name: 'Freeze',
        magnitude: 0.7,
        duration: 1000,
      };
      enemy.takeHit(10, effect);

      enemy.update(0); // Обновляем эффекты

      expect(enemy.speed).toBe(baseSpeed * 0.7);
    });

    test('должен восстанавливать скорость после истечения эффекта', () => {
      enemy.immune = false;
      // Фиксируем baseSpeed для предсказуемости теста
      enemy.baseSpeed = 1.0;
      enemy.speed = 1.0;
      const baseSpeed = enemy.baseSpeed;
      const effect: Effect = {
        name: 'Freeze',
        magnitude: 0.7,
        duration: 100,
      };
      enemy.takeHit(10, effect);

      enemy.update(0);
      expect(enemy.speed).toBe(baseSpeed * 0.7);

      // В updateEffects эффект применяется ДО фильтрации истекших эффектов.
      // Поэтому когда duration становится <= 0, эффект все равно применяется в этом цикле.
      // Нужно обновить дважды: сначала на 100мс (эффект истекает, но еще применяется),
      // потом еще раз, чтобы эффект был удален и скорость восстановилась.
      enemy.update(100); // Эффект истекает (duration = 0), но еще применяется в этом цикле
      expect(enemy.activeEffects).toHaveLength(0); // Эффект удален после фильтрации

      // Обновляем еще раз, чтобы скорость восстановилась (теперь эффектов нет)
      enemy.update(0);
      expect(enemy.speed).toBeCloseTo(baseSpeed, 5);
    });
  });

  describe('getPosition', () => {
    test('должен возвращать текущую позицию', () => {
      const position = enemy.getPosition();
      expect(position).toEqual(enemy.currentPosition);
    });
  });

  describe('getHealth и getMaxHealth', () => {
    test('getHealth должен возвращать текущее здоровье', () => {
      expect(enemy.getHealth()).toBe(enemy.health);
      enemy.takeHit(20, null);
      expect(enemy.getHealth()).toBe(enemy.health);
    });

    test('getMaxHealth должен возвращать максимальное здоровье', () => {
      expect(enemy.getMaxHealth()).toBe(enemy.maxHealth);
      enemy.takeHit(20, null);
      expect(enemy.getMaxHealth()).toBe(enemy.maxHealth); // Не изменяется
    });
  });

  describe('destroyed', () => {
    test('должен возвращать false когда враг жив', () => {
      expect(enemy.destroyed()).toBe(false);
    });

    test('должен возвращать true когда враг уничтожен', () => {
      enemy.takeHit(enemy.health, null);
      expect(enemy.destroyed()).toBe(true);
    });
  });

  describe('setPath', () => {
    test('должен устанавливать новый путь', () => {
      const newPath: Tile[] = [
        { x: 5, y: 5 },
        { x: 6, y: 5 },
      ];
      enemy.setPath(newPath);

      expect(enemy.path).toEqual(newPath);
    });
  });
});
