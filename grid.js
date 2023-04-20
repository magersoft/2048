import { Cell } from './cell.js';
export class Grid {
    constructor(gridElement, gridSize) {
        this.cells = [];
        this.cellsGroupedByColumn = [];
        this.cellsGroupedByReversedColumn = [];
        this.cellsGroupedByRow = [];
        this.cellsGroupedByReversedRow = [];
        this.gridSize = 4;
        this.cellsCount = this.gridSize * this.gridSize;
        this.cellsCount = gridSize ? gridSize * gridSize : this.cellsCount;
        for (let i = 0; i < this.cellsCount; i++) {
            this.cells.push(new Cell(gridElement, i % this.gridSize, Math.floor(i / this.gridSize)));
        }
        this.cellsGroupedByColumn = this.groupCellsByColumn();
        this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map((column) => [...column].reverse());
        this.cellsGroupedByRow = this.groupCellsByRow();
        this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map((row) => [...row].reverse());
    }
    getRandomEmptyCell() {
        const emptyCells = this.cells.filter(cell => cell.isEmpty());
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        return emptyCells[randomIndex];
    }
    groupCellsByColumn() {
        return this.cells.reduce((groupedCells, cell) => {
            groupedCells[cell.x] = groupedCells[cell.x] || [];
            groupedCells[cell.x][cell.y] = cell;
            return groupedCells;
        }, []);
    }
    groupCellsByRow() {
        return this.cells.reduce((groupedCells, cell) => {
            groupedCells[cell.y] = groupedCells[cell.y] || [];
            groupedCells[cell.y][cell.x] = cell;
            return groupedCells;
        }, []);
    }
}
