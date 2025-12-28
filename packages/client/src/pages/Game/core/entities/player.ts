import { GameConfig } from '../../constants/game-config';

class Player {
  private playerHealth = GameConfig.hp;
  private money = GameConfig.initialMoney;

  takeDamage() {
    this.playerHealth -= 1;
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
  }

  subtractMoney(amount: number) {
    this.money -= amount;
  }

  getMoney() {
    return this.money;
  }

  haveEnoughMoney(amount: number) {
    return this.money >= amount;
  }
}

export default Player;
