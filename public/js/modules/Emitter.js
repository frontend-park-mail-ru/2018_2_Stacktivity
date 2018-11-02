/**
 * @
 */
class Emitter {
    constructor() {
        if (Emitter.__instance) {
            return Emitter.__instance;
        }

        this._listeners = {};
        Emitter.__instance = this;
    }

    on(event, callback) { // подписываемся на событие
        if (!this._listeners[event]) {
            this._listeners[event] = [];
        }

        this._listeners[event].push(callback);
    }

    off(event, callback) { // отписываемся от события
        this._listeners[event] = this._listeners[event].filter(function (listener) {
            return listener !== callback;
        });
    }

    emit(event, data) { // публикуем (диспатчим, эмитим) событие
        this._listeners[event].forEach(function (listener) {
            listener(data);
        });
    }
}

export default new Emitter();