import { eventBus } from '../utils/eventBus';
import { Point, Tile } from '../utils/types';
import Cannon from '../entities/cannon';
import Enemy from '../entities/enemy';
import ProjectileManager from './projectileManager';
import Player from '../entities/player';
import { CannonsConfig, CannonType } from '../../constants/cannons-config';

class CannonManager {
  context: CanvasRenderingContext2D;
  cannons: Cannon[] = [];
  private projectileManager: ProjectileManager;
  private unsubscribe: (() => void) | null = null;
  private player: Player;

  constructor(context: CanvasRenderingContext2D, player: Player) {
    this.context = context;
    this.projectileManager = new ProjectileManager(context);
    this.player = player;
  }

  initialize(): void {
    this.addEventListeners();
  }

  addCannon(position: Tile, cannonType: CannonType): void {
    const cannon = new Cannon(position, cannonType, this.projectileManager);
    this.cannons.push(cannon);
  }

  removeCannonById(id: string): void {
    this.cannons = this.cannons.filter(c => c.id !== id);
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

  getCannonById(id: string): Cannon | undefined {
    return this.cannons.find(cannon => cannon.id === id);
  }

  getCannonAtPosition(tile: Point): Cannon | undefined {
    return this.cannons.find(
      cannon => cannon.position.x === tile.x && cannon.position.y === tile.y
    );
  }

  upgradeCannon(id: string): boolean {
    const cannon = this.getCannonById(id);
    if (!cannon) return false;
    cannon.upgrade();
    return true;
  }

  sellCannon(id: string): [Cannon | null, number] {
    const cannon = this.getCannonById(id);
    if (!cannon) {
      return [null, 0];
    }
    const sellValue = cannon.getSellValue();
    this.removeCannonById(id);

    return [cannon, sellValue];
  }

  removeEventListeners(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private addEventListeners(): void {
    this.unsubscribe = eventBus.on(
      'mapManager:cannonPlaced',
      ({ tile, cannonType }: { tile: Tile; cannonType: CannonType }) => {
        this.addCannon(tile, cannonType);
        this.player.subtractMoney(CannonsConfig[cannonType].cost);
        eventBus.emit('redux:setMoney', { money: this.player.getMoney() });
      }
    );
  }
}

export default CannonManager;
