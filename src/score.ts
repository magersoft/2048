export class Score {
  constructor(gameBoard: HTMLDivElement) {
    this.createScoreElement(gameBoard);
  }

  public updateScore(score: number): void {
    const savedScore = this.getScore();

    if (score <= savedScore) return;

    const scoreElement = document.querySelector('.score') as HTMLDivElement;
    scoreElement.textContent = `Your score: ${score}`;

    this.saveScore(score);
  }

  private getScore(): number {
    const score = window.localStorage.getItem('score');
    if (!score) return 0;

    return parseInt(score);
  }

  private saveScore(score: number): void {
    window.localStorage.setItem('score', score.toString());
  }

  private createScoreElement(gameBoard: HTMLDivElement): void {
    const score = this.getScore();
    const scoreElement = document.createElement('div');
    scoreElement.classList.add('score');
    scoreElement.textContent = `Your score: ${score}`;
    gameBoard.appendChild(scoreElement);
  }
}
