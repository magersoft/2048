import { Tile } from './tile';

export class Cell {
  public linkedTile: Tile | null = null;
  public linkedTileForMerge: Tile | null = null;
  public x: number;
  public y: number;

  constructor(gridElement: HTMLDivElement, x: number, y: number) {
    this.x = x;
    this.y = y;

    this.createCellElement(gridElement);
  }

  public linkTile(tile: Tile): void {
    tile.setXY(this.x, this.y);
    this.linkedTile = tile;
  }

  public unlinkTile(): void {
    this.linkedTile = null;
  }

  public unlinkTileForMerge(): void {
    this.linkedTileForMerge = null;
  }

  public linkTileForMerge(tile: Tile): void {
    tile.setXY(this.x, this.y);
    this.linkedTileForMerge = tile;
  }

  public isEmpty(): boolean {
    return !this.linkedTile;
  }

  public hasTileForMerge(): boolean {
    return !!this.linkedTileForMerge;
  }

  public canAccept(newTile: Tile): boolean {
    return this.isEmpty() || (!this.hasTileForMerge() && this.linkedTile!.value === newTile.value);
  }

  public mergeTiles(): void {
    this.linkedTile?.setValue(this.linkedTile.value + this.linkedTileForMerge!.value);
    this.linkedTileForMerge!.removeFromDOM();
    this.unlinkTileForMerge();
  }

  private createCellElement(gridElement: HTMLDivElement): void {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    gridElement.appendChild(cell);
  }
}
