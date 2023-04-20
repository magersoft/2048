import { Grid } from './grid';
import { Tile } from './tile';
import { Cell } from './cell';
import { Score } from './score';

export class Game {
  private grid: Grid;
  private gameBoard: HTMLDivElement;
  private score: Score;
  private maxScore: number = 2048;

  constructor(grid: Grid, gameBoard: HTMLDivElement) {
    this.grid = grid;
    this.gameBoard = gameBoard;
    this.score = new Score(gameBoard);
  }

  public start(): void {
    this.grid.getRandomEmptyCell().linkTile(new Tile(this.gameBoard));
    this.grid.getRandomEmptyCell().linkTile(new Tile(this.gameBoard));

    this.setupInputOnce();
  }

  public restart(): void {
    window.location.reload();
  }

  private setupInputOnce(): void {
    window.addEventListener('keydown', this.handleInput.bind(this), { once: true });
  }

  private async handleInput(event: KeyboardEvent): Promise<void> {
    switch (event.key) {
      case 'ArrowUp':
        if (!this.canMoveUp()) {
          this.setupInputOnce();
          return;
        }

        await this.moveUp();

        break;
      case 'ArrowDown':
        if (!this.canMoveDown()) {
          this.setupInputOnce();
          return;
        }

        await this.moveDown();

        break;
      case 'ArrowLeft':
        if (!this.canMoveLeft()) {
          this.setupInputOnce();
          return;
        }

        await this.moveLeft();

        break;
      case 'ArrowRight':
        if (!this.canMoveRight()) {
          this.setupInputOnce();
          return;
        }

        await this.moveRight();

        break;
      default:
        this.setupInputOnce();
        return;
    }

    const newTile = new Tile(this.gameBoard);

    this.grid.getRandomEmptyCell().linkTile(newTile);

    const values = new Set([...this.grid.cells.filter((cell) => !cell.isEmpty()).map((cell) => cell.linkedTile!.value)]);
    const score = Math.max.apply(this, [...values]);

    this.score.updateScore(score);

    if (score === this.maxScore) {
      await newTile.waitForAnimationEnd();
      alert('You win!');
      this.restart();
      return;
    }

    if (!this.canMoveUp() && !this.canMoveDown() && !this.canMoveLeft() && !this.canMoveRight()) {
      await newTile.waitForAnimationEnd();
      alert('Game over!');
      this.restart();
      return;
    }

    this.setupInputOnce();
  }

  private async moveUp(): Promise<void> {
    await this.slideTiles(this.grid.cellsGroupedByColumn);
  }

  private async moveDown(): Promise<void> {
    await this.slideTiles(this.grid.cellsGroupedByReversedColumn);
  }

  private async moveLeft(): Promise<void> {
    await this.slideTiles(this.grid.cellsGroupedByRow);
  }

  private async moveRight(): Promise<void> {
    await this.slideTiles(this.grid.cellsGroupedByReversedRow);
  }

  private async slideTiles(groupedCells: Cell[][]): Promise<void> {
    const promises: Promise<void>[] = [];

    groupedCells.forEach((group) => this.slideTilesInGroup(group, promises));

    await Promise.all(promises);

    this.grid.cells.forEach((cell) => {
      cell.hasTileForMerge() && cell.mergeTiles();
    })
  }

  private slideTilesInGroup(group: Cell[], promises: Promise<void>[]): void {
    for (let i = 1; i < group.length; i++) {
      if (group[i].isEmpty()) continue;

      const cellWithTile = group[i];

      let targetCell;
      let j = i - 1;
      while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile!)) {
        targetCell = group[j];
        j--;
      }

      if (!targetCell) continue;

      promises.push(cellWithTile.linkedTile!.waitForTransitionEnd());

      if (targetCell.isEmpty()) {
        targetCell.linkTile(cellWithTile.linkedTile!);
      } else {
        targetCell.linkTileForMerge(cellWithTile.linkedTile!);
      }

      cellWithTile.unlinkTile();
    }
  }

  private canMove(groupedCells: Cell[][]): boolean {
    return groupedCells.some(group => this.canMoveInGroup(group));
  }

  private canMoveInGroup(group: Cell[]): boolean {
    return group.some((cell, index) => {
      if (index === 0) return false;
      if (cell.isEmpty()) return true;

      const targetCell = group[index - 1];
      return targetCell.canAccept(cell.linkedTile!);
    })
  }

  private canMoveUp(): boolean {
    return this.canMove(this.grid.cellsGroupedByColumn);
  }

  private canMoveDown(): boolean {
    return this.canMove(this.grid.cellsGroupedByReversedColumn);
  }

  private canMoveLeft(): boolean {
    return this.canMove(this.grid.cellsGroupedByRow);
  }

  private canMoveRight(): boolean {
    return this.canMove(this.grid.cellsGroupedByReversedRow);
  }
}
