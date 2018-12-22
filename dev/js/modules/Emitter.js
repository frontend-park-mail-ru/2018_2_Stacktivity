/** @module modules/Emitter */

/**
 * Event messaging service
 * @class Router
 */
export class Emitter {
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

    wipe(event) {
        this._listeners[event] = [];
    }
}

export default new Emitter();