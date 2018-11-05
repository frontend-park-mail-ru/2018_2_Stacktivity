/** @module components/Nav */

import Router from "../modules/Router.mjs";
import Emitter from "../modules/Emitter.js";

/** Renders navigation block in the application views */
export default class NavigationController {
    static _getEventTarget(target) { // для перехода по ссылкам без перезагрузки
        if (!(target instanceof HTMLAnchorElement)) {
            target = target.closest("a");

            if (!target) {
                return null;
            }
        }

        return target;
    }

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