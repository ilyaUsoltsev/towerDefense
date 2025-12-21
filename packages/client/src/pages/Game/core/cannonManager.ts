import { eventBus } from './eventBus';
import { Tile } from './types';
import Cannon from './cannon';
import Enemy from './enemy';
import { GameConfig } from './config';

class CannonManager {
  context: CanvasRenderingContext2D;
  cannons: Cannon[] = [];

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.addEventListeners();
  }

  private addEventListeners(): void {
    eventBus.on('mapManager:cannonPlaced', (tile: Tile) => {
      this.addCannon(tile);
    });
  }

  addCannon(position: Tile): void {
    const cannon = new Cannon(
      position,
      GameConfig.cannon.defaultRange,
      GameConfig.tileSize
    );
    this.cannons.push(cannon);
  }

  removeCannon(position: Tile): void {
    this.cannons = this.cannons.filter(
      cannon =>
        cannon.position.x !== position.x || cannon.position.y !== position.y
    );
  }

  update(enemies: Enemy[]): void {
    const currentTime = Date.now();
    this.cannons.forEach(cannon => {
      cannon.update(enemies, currentTime);
    });
  }

  render(): void {
    this.cannons.forEach(cannon => {
      cannon.render(this.context);
    });
  }

  getCannons(): Cannon[] {
    return this.cannons;
  }
}

export default CannonManager;
