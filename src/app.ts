import { Grid } from './grid';
import { Game } from './game';

const gameBoard = document.getElementById('game-board') as HTMLDivElement;

const grid = new Grid(gameBoard);
const game = new Game(grid, gameBoard);

game.start();
