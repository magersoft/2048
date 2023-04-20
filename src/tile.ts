export class Tile {
  public value: number = 0;

  private tileElement: HTMLDivElement = undefined as any;
  private x: number = 0;
  private y: number = 0;

  constructor(gridElement: HTMLDivElement) {
    this.createTileElement(gridElement);
    this.setValue(Math.random() > 0.5 ? 2 : 4);
  }

  public setXY(x: number, y: number): void {
    this.x = x;
    this.y = y;

    this.tileElement?.style.setProperty('--x', x.toString());
    this.tileElement?.style.setProperty('--y', y.toString());
  }

  public setValue(value: number): void {
    this.value = value;
    this.tileElement!.textContent = value.toString();

    const bgLightness = 100 - Math.log2(value) * 9;
    this.tileElement.style.setProperty('--bg-lightness', `${bgLightness}%`);
    this.tileElement.style.setProperty('--text-lightness', `${bgLightness < 50 ? 90 : 10}%`);
  }

  public waitForTransitionEnd(): Promise<void> {
    return new Promise((resolve: any) => {
      this.tileElement.addEventListener('transitionend', resolve, { once: true });
    });
  }
  public waitForAnimationEnd(): Promise<void> {
    return new Promise((resolve: any) => {
      this.tileElement.addEventListener('animationend', resolve, { once: true });
    });
  }

  public removeFromDOM(): void {
    this.tileElement.remove();
  }

  private createTileElement(gridElement: HTMLDivElement): void {
    this.tileElement = document.createElement('div');
    this.tileElement.classList.add('tile');
    this.tileElement.textContent = this.value.toString();
    gridElement.appendChild(this.tileElement);
  }
}
