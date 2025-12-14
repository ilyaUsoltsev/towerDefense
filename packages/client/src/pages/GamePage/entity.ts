import { eventBus } from './eventBus';
import PathManager from './pathManager';
import { Point, Tile } from './types';

class Entity {
  path: Tile[] = [];
  currentPosition: Point;
  speed = 1;
  currentIndex: number;
  pathManager: PathManager;

  constructor(start: Tile, pathManager: PathManager) {
    this.pathManager = pathManager;
    this.currentPosition = {
      x: start.x * 32 + 16,
      y: start.y * 32 + 16,
    };
    this.currentIndex = 0;
    this.addEventListeners();
  }

  setPath(path: Tile[]) {
    this.path = path;
    // this.currentIndex = 0
  }

  moveAlongPath() {
    if (this.path.length === 0) {
      return;
    }

    const nextTile = this.path[this.currentIndex + 1];

    if (this.hasReachedEnd()) {
      return;
    }

    if (!nextTile) return;

    const targetPosition = {
      x: nextTile.x * 32 + 16,
      y: nextTile.y * 32 + 16,
    };

    const dx = targetPosition.x - this.currentPosition.x;
    const dy = targetPosition.y - this.currentPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.speed) {
      this.currentPosition = targetPosition;
      this.currentIndex++;
    } else {
      this.currentPosition.x += (dx / distance) * this.speed;
      this.currentPosition.y += (dy / distance) * this.speed;
    }
  }

  getPosition(): Point {
    return this.currentPosition;
  }

  hasReachedEnd(): boolean {
    return this.currentIndex >= this.path.length - 1;
  }

  render(context: CanvasRenderingContext2D) {
    this.moveAlongPath();
    context.fillStyle = 'red';
    context.beginPath();
    context.arc(
      this.currentPosition.x,
      this.currentPosition.y,
      10,
      0,
      2 * Math.PI
    );
    context.fill();
  }

  private addEventListeners() {
    eventBus.on('pathManager:pathUpdated', () => {
      const currentPositionTile: Tile = {
        x: Math.floor(this.currentPosition.x / 32),
        y: Math.floor(this.currentPosition.y / 32),
        id: 'current',
      };
      this.pathManager
        .getPath(currentPositionTile)
        .then((newPathForEntity: Tile[]) => {
          this.setPath(newPathForEntity);
          this.currentIndex = 0;
        });
    });
  }
}

export default Entity;
