import {WSPath} from "../config.js";
import Emitter from "./Emitter.js";

class WebSocks {
    /** Create the websockets module */
    constructor() {
        if (WebSocks.__instance) {
            return WebSocks.__instance;
        }

        this._connected = false;

        this._ws = null;

        Emitter.on("game-send", this.send.bind(this));

        WebSocks.__instance = this;
    }

    get isConnected() {
        return this._connected;
    }

    send(data) {
        if (this._connected) {
            this._ws.send(JSON.stringify(data));
        }
    }

    connect() {
        if (!this._connected) {
            this._ws = new WebSocket(WSPath);

            this._ws.addEventListener("open", this._onopen.bind(this));
            this._ws.addEventListener("message", this._onmessage.bind(this));
            this._ws.addEventListener("error", this._onerror.bind(this));
            this._ws.addEventListener("close", this._onclose.bind(this));
        }
    }

    _onmessage(event) {
        const message = JSON.parse(event.data);
        Emitter.emit("game-message", message);
    }

    _onerror(error) {
        Emitter.emit("error", `ws error ${error.message}`);
    }

    _onopen() {
        this._connected = true;
    }

    _onclose(event) {
        console.log(`Код: ${event.code}`);
        console.log(`Причина: ${event.reason}`);

        if (event.code !== 1000) {
            Emitter.emit("error", `${event.code} ${event.reason}`);
        }
    }
}

export default new WebSocks();