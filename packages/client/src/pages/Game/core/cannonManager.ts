import { eventBus } from './eventBus';
import { Tile } from './types';
import Cannon from './cannon';
import Enemy from './enemy';
import { GameConfig } from './config';
import ProjectileManager from './projectileManager';

class CannonManager {
  context: CanvasRenderingContext2D;
  cannons: Cannon[] = [];
  private projectileManager: ProjectileManager;
  private unsubscribe!: () => void;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
    this.projectileManager = new ProjectileManager(context);
    this.addEventListeners();
  }

  addCannon(position: Tile): void {
    const cannon = new Cannon(
      position,
      GameConfig.cannon.defaultRange,
      GameConfig.tileSize,
      this.projectileManager
    );
    this.cannons.push(cannon);
  }

  removeCannon(position: Tile): void {
    this.cannons = this.cannons.filter(
      cannon =>
        cannon.position.x !== position.x || cannon.position.y !== position.y
    );
  }

  update(enemies: Enemy[], timestamp: number): void {
    this.cannons.forEach(cannon => {
      cannon.update(enemies, timestamp);
    });
    this.projectileManager.update(enemies);
  }

  render(): void {
    this.cannons.forEach(cannon => {
      cannon.render(this.context);
    });
    this.projectileManager.render();
  }

  getCannons(): Cannon[] {
    return this.cannons;
  }

  destroy(tile: Tile): void {
    this.cannons = this.cannons.filter(
      cannon => cannon.position.x !== tile.x || cannon.position.y !== tile.y
    );
  }

  removeEventListeners(): void {
    this.unsubscribe();
  }

  private addEventListeners(): void {
    this.unsubscribe = eventBus.on('mapManager:cannonPlaced', (tile: Tile) => {
      this.addCannon(tile);
    });
  }
}

export default CannonManager;
