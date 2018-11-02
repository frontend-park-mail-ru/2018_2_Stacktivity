/** @module modules/router */
import {errorHandler} from "./ajax.mjs";
import Emitter from "./Emitter.js";

/** Router is providing navigation */
class Router {
    /** Create the router */
    constructor() {
        this._routes = {};
        this._currentRoute = null;

        Emitter.on("done-user-logout", open("/").bind(this));
    }

    /**
     * Regester the new action to invoke
     *
     * @param {string} name - Name of action
     * @param {string} path - Path to display in navbar
     * @param {function} ControllerClass - Action to invore
     *
     * @return {Router} - Current object instance
     */
    add(path, Controller, View) {
        this._routes[path] = {
            controller: new Controller(View),
        };

        return this;
    }

    /**
     * Executes action by the name
     *
     * @param {string} name - name of the action
     * @param param - argument for action
     *
     * @return {Router} - Current object instance
     */
    open(path = "/") {
        if (!this._routes[path]) {
            errorHandler("no such path is registred");
            return;
        }

        this._routes[path].controller.operate();

        if (controller === null) {
            controller = new Controller();

            if(controller.)
            this._renderRoot.appendChild();
        }

        if (view === null) {
            view = new Action(viewSection)
        }


        if (param) {
            path += `\\${param}`;
        }


        this._currentRoute = path;
        window.history.pushState({lastRoute: this._currentRoute}, "", path);
        this._routes[name].action(param);

        return this;
    }
}

export let router = new Router();


/**
 * @function getEventTarget - Returns <a> element
 * @param target - Element on which event was called
 * @return element <a>
 */
function getEventTarget(target) { // для перехода по ссылкам без перезагрузки
    if (!(target instanceof HTMLAnchorElement)) {
        target = target.closest("a");

        if (!target) {
            return null;
        }
    }

    return target;
}

rootElem.addEventListener("click", function (event) {
    let link = getEventTarget(event.target);
    if (!link) {
        return;
    }

    event.preventDefault();
    router.open(link.dataset.page);
});

window.addEventListener('popstate', function (event) {
    event.preventDefault();

    if (event.state.lastRoute) {
        router.open(event.state.lastRoute);
    }

});