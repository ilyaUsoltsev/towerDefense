import { eventBus } from './eventBus';
import mapData from './map.json';
import { Tile } from './types';

class MapManager {
  context: CanvasRenderingContext2D;
  mapData: typeof mapData;
  tileSize: number;
  mapWidth: number;
  mapHeight: number;
  collisionMap: (0 | 1)[][];
  private boundClickOnMap: (event: MouseEvent) => void;

  constructor(context: CanvasRenderingContext2D) {
    this.mapData = mapData;
    this.tileSize = mapData.tileSize;
    this.mapWidth = mapData.mapWidth;
    this.mapHeight = mapData.mapHeight;
    this.context = context;
    this.collisionMap = this.createCollisionGrid();
    this.boundClickOnMap = this.clickOnMap.bind(this);
    this.addEventListeners();
  }

  public getStartTile(): Tile {
    const tiles = this.getTiles('Start');
    return tiles[0];
  }

  public getFinishTile(): Tile {
    const tiles = this.getTiles('Finish');
    return tiles[0];
  }

  public renderGameField() {
    const tiles = this.getTiles('Game');
    this.renderTiles(tiles, 'lightblue');
  }

  public renderWalls() {
    const walls = this.getTiles('Walls');
    this.renderTiles(walls, 'gray');
  }

  public renderStart() {
    const startTiles = this.getTiles('Start');
    this.renderTiles(startTiles, 'green');
  }

  public renderFinish() {
    const finishTiles = this.getTiles('Finish');
    this.renderTiles(finishTiles, 'red');
  }

  private addEventListeners() {
    this.context.canvas.addEventListener('click', this.boundClickOnMap);
  }

  public removeEventListeners() {
    this.context.canvas.removeEventListener('click', this.boundClickOnMap);
  }

  private clickOnMap(event: MouseEvent): void {
    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);

    const startTile = this.getStartTile();

    if (tileX === startTile.x && tileY === startTile.y) {
      return; // Prevent placing cannon on start tile, a* will fail
    }

    if (this.collisionMap[tileY][tileX] === 0) {
      const cannonTile = { x: tileX, y: tileY, id: 'cannon' };
      this.collisionMap[tileY][tileX] = 1;
      eventBus.emit('mapManager:tryAddCannon', {
        cannonTile,
        collisionMap: this.collisionMap,
      });
    }
  }

  public getTiles(tileName: string): Tile[] {
    const walls = this.mapData.layers.find(layer => layer.name === tileName);
    return walls ? walls.tiles : [];
  }

  private renderTiles(tiles: Tile[], color: string) {
    this.context.fillStyle = color;
    tiles.forEach(tile => {
      this.context.fillRect(
        tile.x * this.tileSize,
        tile.y * this.tileSize,
        this.tileSize,
        this.tileSize
      );
    });
  }

  private createCollisionGrid(): (0 | 1)[][] {
    //  Empty grid initialization with zeroes
    const grid: (0 | 1)[][] = [];
    for (let y = 0; y < this.mapData.mapHeight; y++) {
      grid[y] = new Array(this.mapData.mapWidth).fill(0);
    }

    // Mark collision tiles as 1
    const collisionLayer = this.mapData.layers.find(
      layer => layer.name === 'Walls'
    );
    if (collisionLayer) {
      collisionLayer.tiles.forEach(tile => {
        grid[tile.y][tile.x] = 1;
      });
    }

    return grid;
  }
}

export default MapManager;
