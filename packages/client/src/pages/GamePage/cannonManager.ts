import { eventBus } from './eventBus';
import { Tile } from './types';
import Cannon from './cannon';
import Entity from './entity';

class CannonManager {
  context: CanvasRenderingContext2D;
  cannons: Cannon[] = [];
  tileSize: number;

  constructor(context: CanvasRenderingContext2D, tileSize: number) {
    this.context = context;
    this.tileSize = tileSize;
    this.addEventListeners();
  }

  private addEventListeners(): void {
    eventBus.on('mapManager:cannonPlaced', (tile: Tile) => {
      this.addCannon(tile);
    });
  }

  addCannon(position: Tile): void {
    const cannon = new Cannon(position, 64, this.tileSize);
    this.cannons.push(cannon);
  }

  removeCannon(position: Tile): void {
    this.cannons = this.cannons.filter(
      cannon =>
        cannon.position.x !== position.x || cannon.position.y !== position.y
    );
  }

  update(entities: Entity[]): void {
    const currentTime = Date.now();
    this.cannons.forEach(cannon => {
      cannon.update(entities, currentTime);
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
