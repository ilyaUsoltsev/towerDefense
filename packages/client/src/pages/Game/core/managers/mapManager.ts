import { CannonsConfig, CannonType } from '../../constants/cannons-config';
import { eventBus } from '../utils/eventBus';
import mapData from '../utils/map.json';
import Player from '../entities/player';
import { Point, Tile } from '../utils/types';
import { TileType } from '../utils/constants';

class MapManager {
  context: CanvasRenderingContext2D;
  mapData: typeof mapData;
  tileSize: number;
  mapWidth: number;
  mapHeight: number;
  collisionMap: number[][];
  cursorTile: Point | null = null;
  placingCannonType: CannonType | null = null;
  private mapDataCache = new Map<string, Tile[]>();
  private boundClickOnMap: (event: MouseEvent) => void;
  private boundMouseMoveOnMap: (event: MouseEvent) => void;
  private player: Player;

  constructor(context: CanvasRenderingContext2D, player: Player) {
    this.mapData = mapData;
    this.tileSize = mapData.tileSize;
    this.mapWidth = mapData.mapWidth;
    this.mapHeight = mapData.mapHeight;
    this.context = context;
    this.player = player;
    this.collisionMap = this.createCollisionGrid();
    this.boundClickOnMap = this.clickOnMap.bind(this);
    this.boundMouseMoveOnMap = this.mouseMoveOnMap.bind(this);
  }

  initialize(): void {
    this.addEventListeners();
  }

  getStartTile(): Tile {
    const tiles = this.getTiles('Start');
    return tiles[0];
  }

  getFinishTile(): Tile {
    const tiles = this.getTiles('Finish');
    return tiles[0];
  }

  renderGameField() {
    const tiles = this.getTiles('Game');
    this.renderTiles(tiles, 'lightblue');
  }

  renderWalls() {
    const walls = this.getTiles('Walls');
    this.renderTiles(walls, 'gray');
  }

  renderStart() {
    const startTiles = this.getTiles('Start');
    this.renderTiles(startTiles, 'green');
  }

  renderFinish() {
    const finishTiles = this.getTiles('Finish');
    this.renderTiles(finishTiles, 'red');
  }

  renderCursorTile() {
    this._renderCursorTile();
  }

  getTiles(tileName: string): Tile[] {
    if (this.mapDataCache.has(tileName)) {
      return this.mapDataCache.get(tileName)!;
    }
    const walls = this.mapData.layers.find(layer => layer.name === tileName);
    const result = walls ? walls.tiles : [];
    this.mapDataCache.set(tileName, result);
    return result;
  }

  setPlacingCannonType(cannonType: CannonType | null) {
    this.placingCannonType = cannonType;
  }

  removeEventListeners() {
    this.context.canvas.removeEventListener('click', this.boundClickOnMap);
    this.context.canvas.removeEventListener(
      'mousemove',
      this.boundMouseMoveOnMap
    );
  }

  private addEventListeners() {
    this.context.canvas.addEventListener('click', this.boundClickOnMap);
    this.context.canvas.addEventListener('mousemove', this.boundMouseMoveOnMap);
  }

  private mouseMoveOnMap(event: MouseEvent): void {
    if (!this.placingCannonType) {
      this.cursorTile = null;
      return;
    }
    const { x: tileX, y: tileY } = this.getTileFromMouse(event);
    if (
      // TODO: this is not efficient, we could find boundary tiles once and store them
      this.collisionMap[tileY]?.[tileX] === 0 &&
      this.getTiles('Game').some(tile => tile.x === tileX && tile.y === tileY)
    ) {
      this.cursorTile = { x: tileX, y: tileY };
    } else {
      this.cursorTile = null;
    }
  }

  private clickOnMap(event: MouseEvent): void {
    this.cursorTile = null; // Clear cursor on click
    const { x: tileX, y: tileY } = this.getTileFromMouse(event);

    const startTile = this.getStartTile();

    if (tileX === startTile.x && tileY === startTile.y) {
      return; // Prevent placing cannon on start tile, a* will fail
    }

    if (this.collisionMap[tileY]?.[tileX] === TileType.Cannon) {
      // There's a cannon here, emit selection event
      eventBus.emit('redux:selectedCannon', { x: tileX, y: tileY });
      return;
    }

    if (!this.placingCannonType) {
      return;
    }

    if (
      !this.player.haveEnoughMoney(CannonsConfig[this.placingCannonType].cost)
    ) {
      alert('Not enough money to place cannon');
      return;
    }

    if (this.collisionMap[tileY]?.[tileX] === TileType.Empty) {
      const cannonTile = { x: tileX, y: tileY, id: 'cannon' };
      this.collisionMap[tileY][tileX] = TileType.Cannon;
      eventBus.emit('mapManager:tryAddCannon', {
        cannonTile,
        collisionMap: this.collisionMap,
        cannonType: this.placingCannonType,
      });
    }
  }

  private getTileFromMouse(event: MouseEvent): Tile {
    const rect = (event.target as HTMLCanvasElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);

    return { x: tileX, y: tileY };
  }

  private renderTiles(tiles: Tile[], color: string) {
    this.context.fillStyle = color;
    tiles.forEach(tile => {
      this.addTileToContext(tile.x, tile.y);
    });
  }

  private _renderCursorTile() {
    if (this.cursorTile) {
      this.context.fillStyle = 'rgba(19, 147, 96, 0.75)';
      this.addTileToContext(this.cursorTile.x, this.cursorTile.y);
    }
  }

  private addTileToContext(x: number, y: number) {
    this.context.fillRect(
      x * this.tileSize,
      y * this.tileSize,
      this.tileSize,
      this.tileSize
    );
  }

  private createCollisionGrid(): number[][] {
    //  Empty grid initialization with zeroes
    const grid: number[][] = [];
    for (let y = 0; y < this.mapData.mapHeight; y++) {
      grid[y] = new Array(this.mapData.mapWidth).fill(0);
    }

    // Mark collision tiles as 1
    const collisionLayer = this.mapData.layers.find(
      layer => layer.name === 'Walls'
    );
    if (collisionLayer) {
      collisionLayer.tiles.forEach(tile => {
        grid[tile.y][tile.x] = TileType.Wall;
      });
    }

    return grid;
  }
}

export default MapManager;
