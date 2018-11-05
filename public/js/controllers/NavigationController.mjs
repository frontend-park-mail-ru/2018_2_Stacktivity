/** @module controllers/NavigationController */

import Router from "../modules/Router.mjs";
import Emitter from "../modules/Emitter.js";

/**
 * Navigation controller provides callback for navigation by links without page reloading
 * @class NavigationController
 */
export default class NavigationController {
    /**
     * Check if event target is a link or not
     * @param {HTMLElement} target event target
     * @return {null|HTMLElement} returns element if it is <a>
     * @private
     */
    static _getEventTarget(target) { // для перехода по ссылкам без перезагрузки
        if (!(target instanceof HTMLAnchorElement)) {
            target = target.closest("a");

            if (!target) {
                return null;
            }
        }

        return target;
    }

    /**
     * Callback for links
     * @return {undefined}
     * @param {Event} event "click" event
     */
    keyPressedCallback(event) {
        let link = NavigationController._getEventTarget(event.target);
        if (!link) {
            return;
        }

        event.preventDefault();

        if (link.dataset.href === "/logout") {
            Emitter.emit("user-logout");
        }

        Router.open(link.dataset.href);
    }
}