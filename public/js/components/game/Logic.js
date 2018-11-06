import LogicCircle from "./models/Circle/LogicCircle.js";

export default class Logic {
    constructor() {
        this._window = null;

        this._circles = [];
        this._line = null;
        this._player = null;
        this._enemy = null;
    }

    instance() {
        return this;
    }

    init(game, window) {
        this._window = {
            width: window.width,
            height: window.height
        };
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

    addCircle(params) {
        if (params.circle && params.type) {
            this._circles.push(new LogicCircle(params.circle, params.type));
        }
    }
}