export class Tile {
    constructor(gridElement) {
        this.value = 0;
        this.tileElement = undefined;
        this.x = 0;
        this.y = 0;
        this.createTileElement(gridElement);
        this.setValue(Math.random() > 0.5 ? 2 : 4);
    }
    setXY(x, y) {
        var _a, _b;
        this.x = x;
        this.y = y;
        (_a = this.tileElement) === null || _a === void 0 ? void 0 : _a.style.setProperty('--x', x.toString());
        (_b = this.tileElement) === null || _b === void 0 ? void 0 : _b.style.setProperty('--y', y.toString());
    }
    setValue(value) {
        this.value = value;
        this.tileElement.textContent = value.toString();
        const bgLightness = 100 - Math.log2(value) * 9;
        this.tileElement.style.setProperty('--bg-lightness', `${bgLightness}%`);
        this.tileElement.style.setProperty('--text-lightness', `${bgLightness < 50 ? 90 : 10}%`);
    }
    waitForTransitionEnd() {
        return new Promise((resolve) => {
            this.tileElement.addEventListener('transitionend', resolve, { once: true });
        });
    }
    waitForAnimationEnd() {
        return new Promise((resolve) => {
            this.tileElement.addEventListener('animationend', resolve, { once: true });
        });
    }
    removeFromDOM() {
        this.tileElement.remove();
    }
    createTileElement(gridElement) {
        this.tileElement = document.createElement('div');
        this.tileElement.classList.add('tile');
        this.tileElement.textContent = this.value.toString();
        gridElement.appendChild(this.tileElement);
    }
}
