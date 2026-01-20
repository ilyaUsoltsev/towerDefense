import Player from './player';
import { GameConfig } from '../../constants/game-config';
import { eventBus } from '../utils/eventBus';

// Мокаем eventBus
jest.mock('../utils/eventBus', () => ({
  eventBus: {
    emit: jest.fn(),
    clear: jest.fn(),
  },
}));

describe('Player', () => {
  let player: Player;
  const mockEmit = eventBus.emit as jest.MockedFunction<typeof eventBus.emit>;

  beforeEach(() => {
    player = new Player();
    mockEmit.mockClear();
  });

  afterEach(() => {
    mockEmit.mockClear();
  });

  describe('Инициализация', () => {
    test('должен инициализироваться с начальными значениями из GameConfig', () => {
      expect(player.getHp()).toBe(GameConfig.hp);
      expect(player.getMoney()).toBe(GameConfig.initialMoney);
    });
  });

  describe('takeDamage', () => {
    test('должен уменьшать HP на 1', () => {
      const initialHp = player.getHp();
      const newHp = player.takeDamage();

      expect(newHp).toBe(initialHp - 1);
      expect(player.getHp()).toBe(initialHp - 1);
    });

    test('должен эмитить событие redux:setPlayerHp с новым HP', () => {
      const initialHp = player.getHp();
      player.takeDamage();

      expect(mockEmit).toHaveBeenCalledWith('redux:setPlayerHp', {
        hp: initialHp - 1,
      });
    });

    test('должен возвращать новое значение HP', () => {
      const newHp = player.takeDamage();
      expect(newHp).toBe(player.getHp());
    });
  });

  describe('isDead', () => {
    test('должен возвращать false когда HP > 0', () => {
      expect(player.isDead()).toBe(false);
    });

    test('должен возвращать true когда HP <= 0', () => {
      // Уменьшаем HP до 0
      const hp = player.getHp();
      for (let i = 0; i < hp; i++) {
        player.takeDamage();
      }

      expect(player.isDead()).toBe(true);
    });
  });

  describe('addMoney', () => {
    test('должен увеличивать деньги на указанную сумму', () => {
      const initialMoney = player.getMoney();
      const amount = 50;
      player.addMoney(amount);

      expect(player.getMoney()).toBe(initialMoney + amount);
    });

    test('должен эмитить событие redux:setMoney с новым количеством денег', () => {
      const initialMoney = player.getMoney();
      const amount = 30;
      player.addMoney(amount);

      expect(mockEmit).toHaveBeenCalledWith('redux:setMoney', {
        money: initialMoney + amount,
      });
    });
  });

  describe('subtractMoney', () => {
    test('должен уменьшать деньги на указанную сумму', () => {
      const initialMoney = player.getMoney();
      const amount = 20;
      player.subtractMoney(amount);

      expect(player.getMoney()).toBe(initialMoney - amount);
    });

    test('должен эмитить событие redux:setMoney с новым количеством денег', () => {
      const initialMoney = player.getMoney();
      const amount = 15;
      player.subtractMoney(amount);

      expect(mockEmit).toHaveBeenCalledWith('redux:setMoney', {
        money: initialMoney - amount,
      });
    });
  });

  describe('haveEnoughMoney', () => {
    test('должен возвращать true когда денег достаточно', () => {
      const currentMoney = player.getMoney();
      expect(player.haveEnoughMoney(currentMoney)).toBe(true);
      expect(player.haveEnoughMoney(currentMoney - 1)).toBe(true);
    });

    test('должен возвращать false когда денег недостаточно', () => {
      const currentMoney = player.getMoney();
      expect(player.haveEnoughMoney(currentMoney + 1)).toBe(false);
    });
  });

  describe('getHp и getMoney', () => {
    test('getHp должен возвращать текущее HP', () => {
      expect(player.getHp()).toBe(GameConfig.hp);
      player.takeDamage();
      expect(player.getHp()).toBe(GameConfig.hp - 1);
    });

    test('getMoney должен возвращать текущее количество денег', () => {
      expect(player.getMoney()).toBe(GameConfig.initialMoney);
      player.addMoney(10);
      expect(player.getMoney()).toBe(GameConfig.initialMoney + 10);
    });
  });
});
