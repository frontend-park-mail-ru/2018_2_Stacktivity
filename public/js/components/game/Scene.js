import {ADD_CIRCLE} from "./Events.js";
import {START_GAME} from "./Events.js";
import SceneCircle from "./models/Circle/SceneCircle.js";
import {LOAD_LEVEL} from "./Events.js";


export default class Scene {
    constructor(name) {
        this._ctx = null;

        this._window = null;

        this._name = name;
        this._level = null;
        this._circles = [];
        this._line = null;
        this._player = null;
        this._enemy = null;
    }

    init(game, window, ctx) {
        this._ctx = ctx;

        this._window = {
            width: window.width,
            height: window.height
        };

        game.on(START_GAME, this.start.bind(this), false);
        game.on(ADD_CIRCLE, this.addCircle.bind(this), false);
        game.on(LOAD_LEVEL, this.setLevel.bind(this), false);
    }

    render() {
        this._circles.forEach((circle) => {
            circle.draw(this._ctx);
        });
    }

    clear() {
        const ctx = this._ctx;
        ctx.resetTransform();
        ctx.clearRect(0, 0, this._window.width, this._window.height);
    }

    loopCallback() {
        this.clear();
        this.render();

        window.requestAnimationFrame(this.loopCallback.bind(this));
    }

    start() {
        window.requestAnimationFrame(this.loopCallback.bind(this));
    }


    addCircle(circle) {
        if (circle.num && circle.x && circle.y && circle.r && circle.color) {
            this._circles[circle.num] = new SceneCircle(circle);
        }
    }

    setLevel(level) {
        this._level = level.levelNumber;

        level.circles.forEach((circle) => {
            this.addCircle(circle);
        });
    }
}