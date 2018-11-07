import {ADD_CIRCLE, START_GAME, LOAD_LEVEL, LINE_UPDATED, LINE_INPUT} from "./Events.js";
import SceneCircle from "./models/Circle/SceneCircle.js";
import SceneLine from "./models/Line/SceneLine.js";
import Point from "./models/Point/Point.js";


export default class Scene {
    constructor() {
        this._ctx = null;

        this._window = null;

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
        // game.on(ADD_CIRCLE, this.addCircle.bind(this), false);
        game.on(LOAD_LEVEL, this.setLevel.bind(this), false);
        game.on(LINE_INPUT, this.initLine.bind(this), false);
        game.on(LINE_UPDATED, this.updateLine.bind(this), false);
    }

    render() {
        if (this._line) {
            this._line.draw(this._ctx);
        }
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

    updateLine({beginLine, endLine}) {
        this._line.beginLine = beginLine;
        this._line.endLine = endLine;
    }

    initLine() {
        this._line = new SceneLine(new Point(-10, -10));
    }
}