import {LEVEL_START, LEVEL_LOAD, LINE_UPDATED, LINE_INPUT, LINE_DROP, CIRCLE_DROP, WAY_HIDE, WAY_SHOW} from "./Events.js";
import SceneCircle from "./models/Circle/SceneCircle.js";
import SceneLine from "./models/Line/SceneLine.js";
import Point from "./models/Point/Point.js";
import {LEVEL_SHOW_LINE_FAILED, LEVEL_SHOW_PREVIEW, LEVEL_STOP} from "./Events";


export default class Scene {
    constructor(game) {
        this._game = game;

        this._ctx = null;

        this._window = null;

        this._levelNumber = null;

        this._circles = [];
        this._line = null;

        this._player = null;
        this._enemy = null;

        this._stop = true;
    }

    init(window, ctx) {
        this._ctx = ctx;

        this._window = {
            width: window.width,
            height: window.height
        };

        this._game.on(LEVEL_START, this.start.bind(this), false);
        this._game.on(LEVEL_STOP, this.stop.bind(this), false);
        this._game.on(LEVEL_LOAD, this.loadLevel.bind(this), false);

        this._game.on(LEVEL_SHOW_PREVIEW, this.showLevelPreview.bind(this), false);
        this._game.on(LEVEL_SHOW_LINE_FAILED, this.showLineFailed.bind(this), false);

        this._game.on(LINE_INPUT, this.initLine.bind(this), false);
        this._game.on(LINE_UPDATED, this.updateLine.bind(this), false);
        this._game.on(LINE_DROP, this.dropLine.bind(this), false);

        this._game.on(CIRCLE_DROP, this.dropCircle.bind(this), false);

        this._game.on(WAY_SHOW, this.showWay.bind(this), false);
        this._game.on(WAY_HIDE, this.hideWay.bind(this), false);
    }

    loadLevel(level) {
        this._levelNumber = level.levelNumber;
        this._circles = [];

        level.circles.forEach((circle) => {
            this.addCircle(circle);
        });
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
        ctx.clearRect(0, 0, this._window.width, this._window.height);
    }

    loopCallback() {

        if (!this._stop) {
            this.clear();
            this.render();
            window.requestAnimationFrame(this.loopCallback.bind(this));
        }
    }

    start() {
        if (this._stop) {
            this._stop = false;

            this.loopCallback();
        }
    }

    stop() {
        this._stop = true;
    }

    showLevelPreview() {
        this.clear();

        this._ctx.save();

        this._ctx.font = "150px Quantico";
        this._ctx.fillText(this._levelNumber, this._window.width / 2,
             this._window.height / 2);

        this._ctx.restore();
    }

    showLineFailed() {
        this.clear();
        this.render();
    }

    addCircle(circle) {
        if (circle.x && circle.y && circle.r && circle.color) {
            this._circles[circle.num] = new SceneCircle(circle);
        }
    }

    dropCircle({num}) {
        delete this._circles[num];
    }

    updateLine({beginLine, endLine}) {
        this._line.beginLine = beginLine;
        this._line.endLine = endLine;
    }

    initLine() {
        this._line = new SceneLine(new Point(-10, -10));
    }

    dropLine() {
        this._line = null;
    }

    showWay() {
        if (this._line) {
            this._line.showWay = true;
        }
    }

    hideWay() {
        if (this._line) {
            this._line.showWay = false;
        }
    }
}