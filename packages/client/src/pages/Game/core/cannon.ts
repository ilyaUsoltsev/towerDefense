import { Point, Tile } from './types';
import Enemy from './enemy';
import { GameConfig } from './config';
import ProjectileManager from './projectileManager';
import { CannonsConfig, CannonType } from '../utils/cannons';

class Cannon {
  id: string;
  selectedByUser = false;
  position: Tile;
  range: number;
  tileSize: number;
  fireRate: number;
  projectileSpeed: number;
  damage: number;
  lastFireTime = 0;
  level = 1;
  cost: number;
  cannonType: CannonType;
  private projectileManager: ProjectileManager;
  private image: HTMLImageElement;

  constructor(
    position: Tile,
    cannonType: CannonType,
    projectileManager: ProjectileManager
  ) {
    this.id = `cannon-${position.x}-${position.y}`;
    this.tileSize = GameConfig.tileSize;
    this.position = position;
    this.range = CannonsConfig[cannonType].range;
    this.cost = CannonsConfig[cannonType].cost;
    this.damage = CannonsConfig[cannonType].damage;
    this.fireRate = CannonsConfig[cannonType].fireRate;
    this.projectileSpeed = CannonsConfig[cannonType].projectileSeed;
    this.projectileManager = projectileManager;
    this.cannonType = cannonType;

    this.image = new Image();
    this.image.src = `/${cannonType}.png`;
  }

  upgrade(): void {
    this.level += 1;
    this.damage *= 1.5;
    this.range *= 1.2;
    this.fireRate *= 0.5;
    this.projectileSpeed *= 1.1;
  }

  getSellValue(): number {
    return Math.floor(this.cost * 0.7 * this.level);
  }

  getUpgradeCost(): number {
    return Math.floor(this.cost * 1.5 * this.level);
  }

  getCenter(): Point {
    return {
      x: this.position.x * this.tileSize + this.tileSize / 2,
      y: this.position.y * this.tileSize + this.tileSize / 2,
    };
  }

  isEnemyInRange(enemy: Enemy): boolean {
    const enemyPos = enemy.getPosition();
    const cannonCenter = this.getCenter();
    const dx = enemyPos.x - cannonCenter.x;
    const dy = enemyPos.y - cannonCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= this.range;
  }

  canFire(currentTime: number): boolean {
    return currentTime - this.lastFireTime >= this.fireRate;
  }

  shootAt(target: Point, currentTime: number): void {
    if (!this.canFire(currentTime)) {
      return;
    }

    const cannonCenter = this.getCenter();
    this.projectileManager.createProjectile(
      cannonCenter,
      target,
      this.cannonType
    );
    this.lastFireTime = currentTime;
  }

  update(enemies: Enemy[], currentTime: number): void {
    const enemiesInRange = enemies.filter(
      enemy => this.isEnemyInRange(enemy) && !enemy.hasReachedEnd()
    );

    if (enemiesInRange.length > 0 && this.canFire(currentTime)) {
      const target = enemiesInRange[0].getPosition();
      this.shootAt(target, currentTime);
    }
  }

  setSelected(selected: boolean): void {
    this.selectedByUser = selected;
  }

  render(context: CanvasRenderingContext2D): void {
    const center = this.getCenter();

    if (this.image.complete) {
      context.drawImage(
        this.image,
        this.position.x * this.tileSize,
        this.position.y * this.tileSize,
        this.tileSize,
        this.tileSize
      );
    }

    context.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    context.beginPath();
    context.arc(center.x, center.y, this.range, 0, 2 * Math.PI);
    context.stroke();
  }
}

export default Cannon;
