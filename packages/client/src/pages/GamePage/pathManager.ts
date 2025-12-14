import EasyStar from 'easystarjs';
import { Tile } from './types';
import { eventBus } from './eventBus';

class PathManager {
  context: CanvasRenderingContext2D;
  private easyStar: EasyStar.js;
  startTile: Tile;
  endTile: Tile;
  statFinishPath: Tile[] = [];

  constructor(context: CanvasRenderingContext2D, start: Tile, end: Tile) {
    this.context = context;
    this.startTile = start;
    this.endTile = end;
    this.easyStar = new EasyStar.js();
    this.easyStar.disableCornerCutting();
    this.easyStar.setAcceptableTiles([0]);
    this.addEventListeners();
  }

  public async setCollisionMap(collisionMap: (0 | 1)[][]) {
    this.easyStar.setGrid(collisionMap);
    const path = await this.getPath(this.startTile, this.endTile);
    this.statFinishPath = path;
    eventBus.emit('pathManager:pathUpdated', path);
    return path;
  }

  public getStartFinishPath(): Tile[] {
    return this.statFinishPath;
  }

  public async getPath(start?: Tile, end?: Tile): Promise<Tile[]> {
    return await this.findPath(start ?? this.startTile, end ?? this.endTile);
  }

  private addEventListeners() {
    eventBus.on('mapManager:collisionMap', collisionMap => {
      this.setCollisionMap(collisionMap);
    });
  }

  private async findPath(
    startPoint: { x: number; y: number; id: string },
    endPoint: { x: number; y: number; id: string }
  ): Promise<Tile[]> {
    return new Promise((resolve, reject) => {
      this.easyStar.findPath(
        startPoint.x,
        startPoint.y,
        endPoint.x,
        endPoint.y,
        path => {
          if (path === null) {
            reject(new Error('No path found'));
          } else {
            // Convert to Point objects
            const pointPath = path.map(p => ({ x: p.x, y: p.y, id: 'path' }));
            resolve(pointPath);
          }
        }
      );
      this.easyStar.calculate();
    });
  }

  // Temprorary method for rendering tiles (for debugging)
  public renderPathStartFinish() {
    this.context.fillStyle = 'yellow';
    this.statFinishPath.forEach(tile => {
      this.context.fillRect(tile.x * 32, tile.y * 32, 32, 32);
    });
  }
}

export default PathManager;
