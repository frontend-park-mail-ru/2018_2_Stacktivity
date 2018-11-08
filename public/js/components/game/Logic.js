import LogicCircle from "./models/Circle/LogicCircle.js";
import {START_GAME, LOAD_LEVEL, LINE_DROP, LINE_UPDATED,
    LINE_ADD_POINT, LINE_GO, LINE_INPUT, CIRCLE_DROP, LEVEL_RESTART} from "./Events.js";
import {RPS} from "./configs/config.js";
import LogicLine from "./models/Line/LogicLine.js";


export default class Logic {
    constructor(game) {
        this._game = game;
        this._window = null;

        this._reconDelay = 1000 / RPS;

        this._circles = [];
        this._line = null;
        this._inputting = false;

        this._player = null;
        this._enemy = null;
    }

    init(window) {
        this._window = {
            width: window.width,
            height: window.height
        };

        this._game.on(START_GAME, this.start.bind(this), false);
        this._game.on(LOAD_LEVEL, this.setLevel.bind(this), false);

        this._game.on(LINE_INPUT, this.startLineInput.bind(this), false);
        this._game.on(LINE_ADD_POINT, this.addPointInLine.bind(this), false);
        this._game.on(LINE_GO, this.finishLineInput.bind(this), false);
        this._game.on(LINE_DROP, this.dropLine.bind(this), false);

        this._game.on(CIRCLE_DROP, this.dropCircle.bind(this), false);
    }

    reckon() {
        if (this._line && !this._inputting) {
            if (this._line.step()) {
                this._game.emit(LINE_UPDATED, this._line.copyLine());

                this.checkCollision();
            } else {
                this._game.emit(LEVEL_RESTART);
            }
        }
    }

    loopCallback() {
        this.reckon();

        window.setTimeout(this.loopCallback.bind(this), this._reconDelay);
    }

    start() {
        window.setTimeout(this.loopCallback.bind(this), this._reconDelay);
    }

    get circles() {
        return this._circles;
    }

    set circles(value) {
        this._circles = value;
    }

    addCircle(circle) {
        if (circle.num && circle.x && circle.y && circle.r && circle.type) {
            this._circles[circle.num] = new LogicCircle(circle);
        }
    }

    dropCircle({num}) {
        delete this._circles[num];
    }

    setLevel(level) {
        this._game.emit(LINE_DROP);

        level.circles.forEach((circle) => {
            this.addCircle(circle);
        });
    }

    startLineInput(point) {
        this._game.emit(LEVEL_RESTART);

        this._line = new LogicLine(point, this._window);
        this._inputting = true;
    }

    addPointInLine(point) {
        if (this._inputting) {
            this._line.addPoint(point.copy());
            this._game.emit(LINE_UPDATED, this._line.copyLine());

            if (!this.validatePoint(point)) {
                this._game.emit(LINE_GO);
            }
        }
    }

    finishLineInput() {
        if (this._inputting) {
            this._inputting = false;
            this._line.inputting = false;
        }
    }

    dropLine() {
        this._line = null;
        this._inputting = false;
    }

    validatePoint(point) {
        return !this._circles.some((circle) => circle.isIntersectedWithPoint(point));
    }

    checkCollision() {
        this._circles.forEach((circle) => {
            if (circle.isIntersectedWithSegment(this._line.getLastLine())) {
                switch (circle.type) {
                    case "wall":
                        this._game.emit(LEVEL_RESTART);
                        break;
                    case "goal":
                        this._game.emit(CIRCLE_DROP, {num: circle.num});
                        break;
                    default:
                }
            }
        });
    }
}