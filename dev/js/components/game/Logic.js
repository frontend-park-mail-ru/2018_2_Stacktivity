import LogicCircle from "./models/Circle/LogicCircle.js";
import {LEVEL_START, LEVEL_LOAD, LINE_DROP, LINE_UPDATED,
    LINE_ADD_POINT, LINE_GO, LINE_INPUT, CIRCLE_DROP, LEVEL_RELOAD, LEVEL_COMPLETE} from "./Events.js";
import {RPS} from "./configs/config.js";
import LogicLine from "./models/Line/LogicLine.js";
import {DEFAULT_WINDOW} from "./configs/config";
import {LEVEL_EVENT, LEVEL_FAILED, LEVEL_STOP} from "./Events";


export default class Logic {
    constructor(game) {
        this._game = game;
        this._window = null;

        this._reconDelay = 1000 / RPS;

        this._circles = [];
        this._goalsCircleCounter = 0;

        this._line = null;
        this._inputting = false;
        this._stop = true;

        this._player = null;
    }

    init(window) {
        this._game.on(LEVEL_START, this.start.bind(this), false);
        this._game.on(LEVEL_LOAD, this.loadLevel.bind(this), false);
        this._game.on(LEVEL_STOP, this.stop.bind(this), false);

        this._game.on(LINE_INPUT, this.startLineInput.bind(this), false);
        this._game.on(LINE_ADD_POINT, this.addPointInLine.bind(this), false);
        this._game.on(LINE_GO, this.finishLineInput.bind(this), false);
        this._game.on(LINE_DROP, this.dropLine.bind(this), false);

        this._game.on(CIRCLE_DROP, this.dropCircle.bind(this), false);

        this._window = {
            width: window.width,
            height: window.height
        };
    }

    loadLevel(level) {
        this._circles = [];
        this._goalsCircleCounter = 0;
        this._game.emit(LINE_DROP);

        level.circles.forEach((circle) => {
            this.addCircle(circle);
        });
    }

    reckon() {
        if (this._line && !this._inputting) {
            if (this._line.step()) {
                this._game.emit(LINE_UPDATED, this._line.copyLine());

                this.checkCollision();
            } else {
                this._game.emit(LEVEL_EVENT, LEVEL_RELOAD);
            }
        }
        if (this._goalsCircleCounter === 0) {
            this._game.emit(LEVEL_EVENT, LEVEL_COMPLETE);
        }
    }

    loopCallback() {
        if (!this._stop) {
            this.reckon();
            window.setTimeout(this.loopCallback.bind(this), this._reconDelay);
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

    checkCollision() {
        this._circles.forEach((circle) => {
            if (this._line && circle.
                isIntersectedWithSegment(this._line.getLastLine())) {
                switch (circle.type) {
                    case "wall":
                        this._game.emit(LEVEL_EVENT, LEVEL_FAILED);
                        break;
                    case "goal":
                        this._game.emit(CIRCLE_DROP, {num: circle.num});
                        break;
                    default:
                        break;
                }
                if (this._inputting) {
                    this._game.emit(LINE_GO);
                }
            }
        });
    }

    get circles() {
        return this._circles;
    }

    set circles(value) {
        this._circles = value;
    }

    addCircle(circle) {
        if (circle !== undefined) {
            this._circles[circle.num] = new LogicCircle(circle);
            if (circle.type === "goal") {
                this._goalsCircleCounter++;
            }
        }
    }

    dropCircle({num}) {
        delete this._circles[num];
        this._goalsCircleCounter--;
    }

    startLineInput(point) {
        if (this._stop) {
            return;
        }
        this._game.emit(LEVEL_EVENT, LEVEL_RELOAD);

        this._line = new LogicLine(point, this._window);
        this._inputting = true;
    }

    finishLineInput() {
        if (this._inputting) {
            this._inputting = false;
            this._line.inputting = false;
        }
    }

    addPointInLine(point) {
        if (this._inputting) {
            this._line.addPoint(point.copy());
            this._game.emit(LINE_UPDATED, this._line.copyLine());

            this.checkCollision();
        }
    }

    dropLine() {
        this._line = null;
        this._inputting = false;
    }
}