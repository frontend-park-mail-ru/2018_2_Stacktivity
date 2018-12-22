import {LEVEL_START, LEVEL_LOAD, LINE_UPDATED, LINE_INPUT, LINE_DROP, CIRCLE_DROP, WAY_HIDE, WAY_SHOW} from "./Events.js";
import SceneCircle from "../../models/Circle/SceneCircle.js";
import SceneLine from "../../models/Line/SceneLine.js";
import Point from "../../models/Point/Point.js";
import {LEVEL_SHOW_LINE_FAILED, LEVEL_SHOW_PREVIEW, LEVEL_STOP} from "./Events";
import {LEVEL_NUMBER_FONT_SIZE, LINE_WIDTH, tutorialLine} from "../../configs/config";
import {TUTOR_NOT_SHOW, TUTOR_SHOW} from "../multiplayer_components/MultiplayerEvents";


export default class Scene {
    constructor(game) {
        this._game = game;

        this._ctx = null;

        this._window = null;
        this._scale = 1;

        this._levelNumber = null;

        this._circles = [];
        this._line = null;

        this._player = null;
        this._enemy = null;

        this._stop = true;

        this._tutorI = 0;
        this._showTutor = false;
    }

    init(window, scale, ctx) {
        this._ctx = ctx;

        this._window = {
            width: window.width,
            height: window.height
        };

        this._scale = scale;

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

        this._game.on(LEVEL_START, this.setShowTutor.bind(this));
        this._game.on(TUTOR_NOT_SHOW, this.unsetShowTutor.bind(this));
    }

    loadLevel(level) {
        this._levelNumber = level.levelNumber;
        this._circles = [];

        level.circles.forEach((circle) => {
            this.addCircle(circle);
        });
    }

    showTutor() {
        if (this._tutorI >= tutorialLine.points.length) {
            this._tutorI = 0;
        }

        this._ctx.save();

        this._ctx.font = `${String(5 * this._game.scale)}vw Quantico`;

        this._ctx.fillStyle = "rgb(0, 0, 0, 0.5)";
        this._ctx.fillText("draw a line", Math.round(tutorialLine.base_point.x * this._game.scale), Math.round((tutorialLine.base_point.y + 40) * this._game.scale));

        this._ctx.lineWidth = LINE_WIDTH * this._game.scale;
        this._ctx.lineCap = "round";
        this._ctx.lineJoin = "round";

        this._ctx.strokeStyle = "rgb(146, 153, 163, 0.5)";

        this._ctx.beginPath();
        this._ctx.moveTo(Math.round(tutorialLine.base_point.x * this._game.scale), Math.round(tutorialLine.base_point.y * this._game.scale));

        for (let i = 0; i <= this._tutorI; i++) {
            this._ctx.lineTo(Math.round((tutorialLine.base_point.x + tutorialLine.points[i].x) * this._game.scale),
                Math.round((tutorialLine.base_point.y + tutorialLine.points[i].y) * this._game.scale));
        }

        this._ctx.stroke();

        this._ctx.restore();
    }

    render() {
        if (this._line) {
            this._line.draw(this._ctx, this._scale);
        }
        this._circles.forEach((circle) => {
            circle.draw(this._ctx);
        });

        if (this._showTutor) {
            this.showTutor();
            this._tutorI++;
        }
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

        this._ctx.textAlign = "center";

        this._ctx.font = `${String((LEVEL_NUMBER_FONT_SIZE + 5) * this._game.scale)}vw Quantico`;
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

    setShowTutor() {
        this._showTutor = true;
        this._tutorI = 0;
    }

    unsetShowTutor() {
        this._showTutor = false;
    }
}