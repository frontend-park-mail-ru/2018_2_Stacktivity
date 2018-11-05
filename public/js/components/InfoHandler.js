/** @module components/InfoHandler */

import Emitter from "../modules/Emitter.js";
import {infoLevel} from "../config.js";

/**
 * @class InfoHandler
 */
class InfoHandler {
    constructor() {
        if (InfoHandler.__instance) {
            return InfoHandler.__instance;
        }

        this._infoblock = document.getElementById("infoblock");

        if (infoLevel > 0) {
            if (infoLevel > 1) {
                if (infoLevel > 2) {
                    Emitter.on("error", this._handleError.bind(this), false);
                }
                Emitter.on("warn", this._handleWarn.bind(this), false);
            }
            Emitter.on("info", this._handleInfo.bind(this), false);
        }

        InfoHandler.__instance = this;
    }

    /**
     * Fade away effect
     * @param {HTMLDivElement} element Info element
     * @param {Number} delay How many msec before fadind starts
     * @param {Number} interval How often will be opacity decrement
     * @param {Number} delta Delta opacity
     * @param {Number} start Start opacity
     * @return {undefined}
     * @private
     */
    __fadeaway(element, delay = 3000, interval = 10, delta = 0.05, start = 0.8) {
        setTimeout(function () {
            element.style.opacity = start;
            let iId = setInterval(function () {
                element.style.opacity -= delta;
                if (element.style.opacity < delta) {
                    clearInterval(iId);
                    element.hidden = true;
                }
            }, interval);
        }, delay);
    }

    /**
     * Shows error message
     * @param {string} msg Error message
     * @return {undefined}
     * @private
     */
    _handleError(msg) {
        let message = document.createElement("div");
        message.classList.add("info", "error");
        message.innerText = msg;
        this._infoblock.prepend(message);
        this.__fadeaway(message);
    }

    /**
     * Shows warning message
     * @param {string} msg Warning message
     * @return {undefined}
     * @private
     */
    _handleInfo(msg) {
        let message = document.createElement("div");
        message.classList.add("info");
        message.innerText = msg;
        this._infoblock.prepend(message);
        this.__fadeaway(message);
    }

    /**
     * Shows info message
     * @param {string} msg Info message
     * @return {undefined}
     * @private
     */
    _handleWarn(msg) {
        let message = document.createElement("div");
        message.classList.add("info", "warn");
        message.innerText = msg;
        this._infoblock.prepend(message);
        this.__fadeaway(message);
    }
}

export default new InfoHandler();