import LogicCircle from "./models/Circle/LogicCircle.js";
import {ADD_CIRCLE} from "./Events.js";
import {START_GAME} from "./Events.js";
import {RPS} from "./configs/config.js";
import {LOAD_LEVEL} from "./Events.js";

export default class Logic {
    constructor() {
        this._window = null;

        this._reconDelay = 1000 / RPS;

        this._circles = [];
        this._line = null;
        this._player = null;
        this._enemy = null;
    }

    init(game, window) {
        this._window = {
            width: window.width,
            height: window.height
        };

        game.on(ADD_CIRCLE, this.addCircle.bind(this), false);
        game.on(START_GAME, this.start.bind(this), false);
        game.on(LOAD_LEVEL, this.setLevel.bind(this), false);
    }

    get circles() {
        return this._circles;
    }

    set circles(value) {
        this._circles = value;
    }

    get line() {
        return this._line;
    }

    set line(value) {
        this._line = value;
    }

    get player() {
        return this._player;
    }

    set player(value) {
        this._player = value;
    }

    get enemy() {
        return this._enemy;
    }

    set enemy(value) {
        this._enemy = value;
    }

    reckon() {
    }

    loopCallback() {
        this.reckon();

        window.setTimeout(this.loopCallback.bind(this), this._reconDelay);
    }

    start() {
        window.setTimeout(this.loopCallback.bind(this), this._reconDelay);
    }

    addCircle(circle) {
        if (circle.num && circle.x && circle.y && circle.r && circle.type) {
            this._circles[circle.num] = new LogicCircle(circle);
        }
    }

    setLevel(level) {
        level.circles.forEach((circle) => {
            this.addCircle(circle);
        });
    }
}