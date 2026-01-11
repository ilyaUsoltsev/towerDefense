import { GameConfig } from '../../constants/game-config';
import { eventBus } from '../utils/eventBus';

class Player {
  private playerHealth = GameConfig.hp;
  private money = GameConfig.initialMoney;

  takeDamage() {
    this.playerHealth -= 1;
    eventBus.emit('redux:setPlayerHp', { hp: this.playerHealth });
    return this.playerHealth;
  }

  isDead() {
    return this.playerHealth <= 0;
  }

  getHp() {
    return this.playerHealth;
  }

  addMoney(amount: number) {
    this.money += amount;
    eventBus.emit('redux:setMoney', { money: this.money });
  }

  subtractMoney(amount: number) {
    this.money -= amount;
    eventBus.emit('redux:setMoney', { money: this.money });
  }

  getMoney() {
    return this.money;
  }

  haveEnoughMoney(amount: number) {
    return this.money >= amount;
  }
}

export default Player;
