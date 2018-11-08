/** @module modules/Router */
import Emitter from "./Emitter.js";

/**
 * Router is providing navigation
 * @class Router
 */
class Router {
    /** Create the router */
    constructor() {
        if (Router.__instance) {
            return Router.__instance;
        }

        this._routes = {};
        this._currentPath = null;

        Emitter.on("wipe-views", () => {
            this.open("/");
            this._updateRender();
        }, false);

        window.addEventListener('popstate', this.popstateCallback.bind(this));

        Router.__instance = this;
    }

    /**
     * @return {Router}
     * Regester the new action to invoke
     * @param {string} path - path for the View
     * @param {Class} View - class of the view
     */
    add(path, View) {
        this._routes[path] = {
            View: View,
            viewEntity: null,
        };

        return this;
    }

    /**
     * @return {Object}
     * Split pathname to path and page
     * @param {string} path - path for the View
     */
    parsePath(path) {
        let aPath = path.split("/");
        return {path: `/${aPath[1]}`, page: aPath[2]};
    }

    /**
     * @return {Router}
     * Shows view linked with path and push pathname to history
     * @param {string} pathname - path for the View
     */
    open(pathname = "/") {
        this._open(pathname);
        window.history.pushState({lastRoute: pathname}, "", pathname);
        return this;
    }

    /**
     * @return {undefined}
     * Shows view linked with path
     * @param {string} pathname - path for the View
     */
    _open(pathname) {
        let {path, page} = this.parsePath(pathname);
        if (!this._routes[path]) {
            Emitter.emit("warn", "no such path is registred");
            this.open("/");
            return;
        }

        let {View, viewEntity} = this._routes[path];

        if (viewEntity === null) {
            viewEntity = new View();
        }

        if (page) {
            Emitter.emit("leaderboard-set-page", page);
        }

        if (!viewEntity.isShown) {
            if (this._currentPath) {
                this._routes[this._currentPath].viewEntity.hide();
            }

            this._currentPath = path;
            viewEntity.show();
        } else if (path === this._currentPath) {
            this._updateRender();
        }

        this._routes[path] = {View, viewEntity};
    }

    /**
     * @return {undefined}
     * Allows to redraw open view
     */
    _updateRender() {
        this._routes[this._currentPath].viewEntity.show();
    }

    /**
     * @return {String} path for the view
     * Get path for View
     * @param {Class} View View's class
     */
    getPathTo(View) {
        Emitter.emit("warning", "getPathTo is under contruction!");
        for (let key in Reflect.getOwnPropertyNames(this._routes)) {
            if (this._routes[key].View === View) {
                return key;
            }
        }
    }

    /**
     * @return {undefined}
     * work with history.api
     * @param {event} event popstate
     */
    popstateCallback(event) {
        event.preventDefault();

        if (event.state.lastRoute) {
            this._open(event.state.lastRoute);
        }
    }
}

export default new Router();