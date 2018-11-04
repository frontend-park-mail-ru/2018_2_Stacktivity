/** @module components/Nav */

import Router from "../modules/Router.mjs";
import {getEventTarget} from "../misc.js";
import Emitter from "../modules/Emitter.js";

/** Renders navigation block in the application views */
export default class NavigationController {
    /** Create the navigation component
     *
     * @param root - rootElem element for the header
     */
    keyPressedCallback(event) {
        let link = getEventTarget(event.target);
        if (!link) {
            return;
        }

        event.preventDefault();

        if (link.dataset.href === "/logout") {
            Emitter.emit("user-logout")
        }

        Router.open(link.dataset.href);
    }
}