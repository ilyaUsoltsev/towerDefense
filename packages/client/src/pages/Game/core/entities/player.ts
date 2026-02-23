import { SoundLib, StopSound } from '../../../../audio/audio';
import { GameConfig } from '../../constants/game-config';
import { eventBus } from '../utils/eventBus';

class Player {
  private playerHealth = GameConfig.hp;
  private money = GameConfig.initialMoney;
  private score = 0;

  takeDamage() {
    this.playerHealth -= 1;
    eventBus.emit('redux:setPlayerHp', { hp: this.playerHealth });
    if (this.playerHealth <= 0) {
      eventBus.emit('redux:gameOver', { isWin: false, score: 0 });
      StopSound('backgroundMusic');
      SoundLib('loss');
    }
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

  addScore(amount: number) {
    this.score += amount;
  }

  getScore() {
    return this.score;
  }

  haveEnoughMoney(amount: number) {
    return this.money >= amount;
  }
}

export default Player;
