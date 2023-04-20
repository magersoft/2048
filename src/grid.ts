import { Cell } from './cell';

export class Grid {
  public cells: Cell[] = [];
  public cellsGroupedByColumn: Cell[][] = [];
  public cellsGroupedByReversedColumn: Cell[][] = [];
  public cellsGroupedByRow: Cell[][] = [];
  public cellsGroupedByReversedRow: Cell[][] = [];

  private gridSize: number = 4;
  private cellsCount: number = this.gridSize * this.gridSize;

  constructor(gridElement: HTMLDivElement, gridSize?: number) {
    this.cellsCount = gridSize ? gridSize * gridSize : this.cellsCount;

    for (let i = 0; i < this.cellsCount; i++) {
      this.cells.push(new Cell(gridElement, i % this.gridSize, Math.floor(i / this.gridSize)));
    }

    this.cellsGroupedByColumn = this.groupCellsByColumn();
    this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map((column) => [...column].reverse());
    this.cellsGroupedByRow = this.groupCellsByRow();
    this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map((row) => [...row].reverse());
  }

  public getRandomEmptyCell(): Cell {
    const emptyCells = this.cells.filter(cell => cell.isEmpty());
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    return emptyCells[randomIndex];
  }

  private groupCellsByColumn(): Cell[][] {
    return this.cells.reduce((groupedCells: Cell[][], cell) => {
      groupedCells[cell.x] = groupedCells[cell.x] || [];
      groupedCells[cell.x][cell.y] = cell;
      return groupedCells;
    }, []);
  }

  private groupCellsByRow(): Cell[][] {
    return this.cells.reduce((groupedCells: Cell[][], cell) => {
      groupedCells[cell.y] = groupedCells[cell.y] || [];
      groupedCells[cell.y][cell.x] = cell;
      return groupedCells;
    }, []);
  }
}
