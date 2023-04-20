export class Score {
    constructor(gameBoard) {
        this.createScoreElement(gameBoard);
    }
    updateScore(score) {
        const savedScore = this.getScore();
        if (score <= savedScore)
            return;
        const scoreElement = document.querySelector('.score');
        scoreElement.textContent = `Your score: ${score}`;
        this.saveScore(score);
    }
    getScore() {
        const score = window.localStorage.getItem('score');
        if (!score)
            return 0;
        return parseInt(score);
    }
    saveScore(score) {
        window.localStorage.setItem('score', score.toString());
    }
    createScoreElement(gameBoard) {
        const score = this.getScore();
        const scoreElement = document.createElement('div');
        scoreElement.classList.add('score');
        scoreElement.textContent = `Your score: ${score}`;
        gameBoard.appendChild(scoreElement);
    }
}
