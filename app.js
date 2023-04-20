import { Grid } from './grid.js';
import { Game } from './game.js';
const gameBoard = document.getElementById('game-board');
const grid = new Grid(gameBoard);
const game = new Game(grid, gameBoard);
game.start();
