import Game from "./Game.js";

const canvas = document.createElement('canvas');
canvas.id = 'canvas';

document.body.appendChild(canvas);

canvas.width = 1240;
canvas.height = 7200;

const width = canvas.width;
const height = canvas.height;

const ctx = canvas.getContext('2d');

const game = new Game(GAME_MODE, {ctx, width, height});

game.start();
