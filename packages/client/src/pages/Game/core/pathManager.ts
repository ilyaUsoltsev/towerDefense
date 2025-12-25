import EasyStar from 'easystarjs';
import { Tile } from './types';
import { eventBus } from './eventBus';
import { GameConfig } from './config';
import Player from './player';

class PathManager {
  context: CanvasRenderingContext2D;
  startTile: Tile;
  endTile: Tile;
  statFinishPath: Tile[] = [];
  private easyStar: EasyStar.js;
  private unsubscribe!: () => void;
  private player: Player;

  constructor(
    context: CanvasRenderingContext2D,
    start: Tile,
    end: Tile,
    player: Player
  ) {
    this.context = context;
    this.startTile = start;
    this.endTile = end;
    this.player = player;
    this.easyStar = new EasyStar.js();
    this.easyStar.disableCornerCutting();
    this.easyStar.enableDiagonals();
    this.easyStar.setAcceptableTiles([0]);
    this.addEventListeners();
  }

  public async setCollisionMap(collisionMap: number[][]) {
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

  public removeEventListeners() {
    this.unsubscribe();
  }

  // Temprorary method for rendering tiles (for debugging)
  public renderPathStartFinish() {
    this.context.fillStyle = 'yellow';
    this.statFinishPath.forEach(tile => {
      this.context.fillRect(
        tile.x * GameConfig.tileSize,
        tile.y * GameConfig.tileSize,
        GameConfig.tileSize,
        GameConfig.tileSize
      );
    });
  }

  private async trySetCollisionMap(tile: Tile, collisionMap: number[][]) {
    collisionMap[tile.y][tile.x] = 1;
    this.easyStar.setGrid(collisionMap);
    try {
      await this.getPath(this.startTile, this.endTile);
      this.setCollisionMap(collisionMap);
      eventBus.emit('mapManager:cannonPlaced', tile);
      return true;
    } catch {
      // No path exists, revert the change
      alert('Cannot place cannon here! It would block all paths.');
      collisionMap[tile.y][tile.x] = 0;
      return false;
    }
  }

  private addEventListeners() {
    this.unsubscribe = eventBus.on('mapManager:tryAddCannon', payload => {
      this.trySetCollisionMap(payload.cannonTile, payload.collisionMap);
    });
  }

  private async findPath(startPoint: Tile, endPoint: Tile): Promise<Tile[]> {
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
}

export default PathManager;
