import {defaultLevels} from "../configs/defaultLevels.js";
import {DEFAULT_WINDOW} from "../configs/config";


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
     * @param {{level: null}} data data
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
        this._scale = 1;

        this._mode = mode;

        this._level = null;
    }

    init({width, height}) {
        this._window = {
            width: width,
            height: height
        };

        this._scale = width / DEFAULT_WINDOW.width;
    }

    static loadLevel(num) {
        if (num < 0 || num > defaultLevels.length) {
            return;
        }
        return defaultLevels[num];
    }

    setLevel(level) {
        this._level = {};
        this._level.levelNumber = level.levelNumber;
        this._level.circles = [];

        level.circles.forEach((circle) => {
            this._level.circles.push({
                num: circle.num,
                x: Math.round(circle.x * this._scale),
                y: Math.round(circle.y * this._scale),
                r: Math.round(circle.r * this._scale),
                type: circle.type,
                color: circle.color
            });
        });
    }


    get window() {
        return this._window;
    }

    set window(value) {
        this._window = value;
    }

    get scale() {
        return this._scale;
    }

    set scale(value) {
        this._scale = value;
    }
}
