import Logic from "./Logic.js";
import Scene from "./Scene.js";
import {START_GAME} from "./Events.js";
import Control from "./Control.js";
import {ADD_CIRCLE} from "./Events.js";
import {defaultLevels} from "./configs/defaultLevels.js";
import {LOAD_LEVEL} from "./Events.js";

// Не получилось нормально отнаследоваться, временно воткнул
class Emitter {
    /** Create the emitter */
    constructor() {
        if (Emitter.__instance) {
            return Emitter.__instance;
        }

        this._listeners = {};
        Emitter.__instance = this;
    }

    /**
     * @return {Emitter}
     * Subscribe on event
     * @param {string} event name of event
     * @param {function} callback callback
     * @param {boolean} once will event be handled one or always
     * */
    on(event, callback, once = true) { // подписываемся на событие
        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }

        this._listeners[event].push({once, callback});

        return this;
    }

    /**
     * @return {Emitter}
     * Unsubscribe on event
     * @param {string} event name of event
     * @param {function} callback callback
     * */
    off(event, callback) { // отписываемся от события
        this._listeners[event] = this._listeners[event].filter(function (listener) {
            return listener !== callback;
        });

        return this;
    }

    /**
     * @return {Emitter}
     * Subscribing on event
     * @param {string} event name of event
     * @param {any} data data
     * */
    emit(event, data) { // публикуем (диспатчим, эмитим) событие
        if (this._listeners[event]) {
            this._listeners[event].forEach(function (listener) {
                listener.callback(data);
            });

            this._listeners[event] = this._listeners[event].filter(function (listener) {
                return !listener.once;
            });
        }

        return this;
    }
}


export default class Game extends Emitter {
    constructor(mode) {
        super();

        this._window = null;

        this._mode = mode;

        this._logic = new Logic();
        this._scene = new Scene("my_scene");
        this._control = new Control();
    }

    init(canvas, {width, height}) {
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'canvas';

            document.body.appendChild(canvas);

            canvas.width = width;
            canvas.height = height;

            this._window = {
                width: width,
                height: height
            };
        } else {
            this._window = {
                width: canvas.width,
                height: canvas.height
            };
        }

        const ctx = canvas.getContext('2d');

        this._logic.init(this, this._window);
        this._scene.init(this, this._window, ctx);
        this._control.init(this, canvas);

        this.emit(LOAD_LEVEL, Game.loadLevel(1));
    }

    start() {
        this.emit(START_GAME);
    }

    static loadLevel(num) {
        if (num - 1 < 0 || num > defaultLevels.length) {
            return;
        }
        return defaultLevels[num - 1];
    }
}
