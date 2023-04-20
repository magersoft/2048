var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Tile } from './tile.js';
import { Score } from './score.js';
export class Game {
    constructor(grid, gameBoard) {
        this.maxScore = 2048;
        this.grid = grid;
        this.gameBoard = gameBoard;
        this.score = new Score(gameBoard);
    }
    start() {
        this.grid.getRandomEmptyCell().linkTile(new Tile(this.gameBoard));
        this.grid.getRandomEmptyCell().linkTile(new Tile(this.gameBoard));
        this.setupInputOnce();
    }
    restart() {
        window.location.reload();
    }
    setupInputOnce() {
        window.addEventListener('keydown', this.handleInput.bind(this), { once: true });
    }
    handleInput(event) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (event.key) {
                case 'ArrowUp':
                    if (!this.canMoveUp()) {
                        this.setupInputOnce();
                        return;
                    }
                    yield this.moveUp();
                    break;
                case 'ArrowDown':
                    if (!this.canMoveDown()) {
                        this.setupInputOnce();
                        return;
                    }
                    yield this.moveDown();
                    break;
                case 'ArrowLeft':
                    if (!this.canMoveLeft()) {
                        this.setupInputOnce();
                        return;
                    }
                    yield this.moveLeft();
                    break;
                case 'ArrowRight':
                    if (!this.canMoveRight()) {
                        this.setupInputOnce();
                        return;
                    }
                    yield this.moveRight();
                    break;
                default:
                    this.setupInputOnce();
                    return;
            }
            const newTile = new Tile(this.gameBoard);
            this.grid.getRandomEmptyCell().linkTile(newTile);
            const values = new Set([...this.grid.cells.filter((cell) => !cell.isEmpty()).map((cell) => cell.linkedTile.value)]);
            const score = Math.max.apply(this, [...values]);
            this.score.updateScore(score);
            if (score === this.maxScore) {
                yield newTile.waitForAnimationEnd();
                alert('You win!');
                this.restart();
                return;
            }
            if (!this.canMoveUp() && !this.canMoveDown() && !this.canMoveLeft() && !this.canMoveRight()) {
                yield newTile.waitForAnimationEnd();
                alert('Game over!');
                this.restart();
                return;
            }
            this.setupInputOnce();
        });
    }
    moveUp() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.slideTiles(this.grid.cellsGroupedByColumn);
        });
    }
    moveDown() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.slideTiles(this.grid.cellsGroupedByReversedColumn);
        });
    }
    moveLeft() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.slideTiles(this.grid.cellsGroupedByRow);
        });
    }
    moveRight() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.slideTiles(this.grid.cellsGroupedByReversedRow);
        });
    }
    slideTiles(groupedCells) {
        return __awaiter(this, void 0, void 0, function* () {
            const promises = [];
            groupedCells.forEach((group) => this.slideTilesInGroup(group, promises));
            yield Promise.all(promises);
            this.grid.cells.forEach((cell) => {
                cell.hasTileForMerge() && cell.mergeTiles();
            });
        });
    }
    slideTilesInGroup(group, promises) {
        for (let i = 1; i < group.length; i++) {
            if (group[i].isEmpty())
                continue;
            const cellWithTile = group[i];
            let targetCell;
            let j = i - 1;
            while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
                targetCell = group[j];
                j--;
            }
            if (!targetCell)
                continue;
            promises.push(cellWithTile.linkedTile.waitForTransitionEnd());
            if (targetCell.isEmpty()) {
                targetCell.linkTile(cellWithTile.linkedTile);
            }
            else {
                targetCell.linkTileForMerge(cellWithTile.linkedTile);
            }
            cellWithTile.unlinkTile();
        }
    }
    canMove(groupedCells) {
        return groupedCells.some(group => this.canMoveInGroup(group));
    }
    canMoveInGroup(group) {
        return group.some((cell, index) => {
            if (index === 0)
                return false;
            if (cell.isEmpty())
                return true;
            const targetCell = group[index - 1];
            return targetCell.canAccept(cell.linkedTile);
        });
    }
    canMoveUp() {
        return this.canMove(this.grid.cellsGroupedByColumn);
    }
    canMoveDown() {
        return this.canMove(this.grid.cellsGroupedByReversedColumn);
    }
    canMoveLeft() {
        return this.canMove(this.grid.cellsGroupedByRow);
    }
    canMoveRight() {
        return this.canMove(this.grid.cellsGroupedByReversedRow);
    }
}
