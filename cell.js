export class Cell {
    constructor(gridElement, x, y) {
        this.linkedTile = null;
        this.linkedTileForMerge = null;
        this.x = x;
        this.y = y;
        this.createCellElement(gridElement);
    }
    linkTile(tile) {
        tile.setXY(this.x, this.y);
        this.linkedTile = tile;
    }
    unlinkTile() {
        this.linkedTile = null;
    }
    unlinkTileForMerge() {
        this.linkedTileForMerge = null;
    }
    linkTileForMerge(tile) {
        tile.setXY(this.x, this.y);
        this.linkedTileForMerge = tile;
    }
    isEmpty() {
        return !this.linkedTile;
    }
    hasTileForMerge() {
        return !!this.linkedTileForMerge;
    }
    canAccept(newTile) {
        return this.isEmpty() || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value);
    }
    mergeTiles() {
        var _a;
        (_a = this.linkedTile) === null || _a === void 0 ? void 0 : _a.setValue(this.linkedTile.value + this.linkedTileForMerge.value);
        this.linkedTileForMerge.removeFromDOM();
        this.unlinkTileForMerge();
    }
    createCellElement(gridElement) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        gridElement.appendChild(cell);
    }
}
