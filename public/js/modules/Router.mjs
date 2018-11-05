/** @module modules/router */
import {errorHandler} from "../misc.js";
import Emitter from "./Emitter.js";

/** Router is providing navigation */
class Router {
    /** Create the router */
    constructor() {
        if (Router.__instance) {
            return Router.__instance;
        }

        this._routes = {};
        this._currentRoute = null;

        Router.__instance = this;
    }

    /**
     * Regester the new action to invoke
     *
     */
    add(path, View) {
        this._routes[path] = {
            View: View,
            viewEntity: null,
        };

        return this;
    }

    /**
     * Executes action by the name
     *
     * @return {Router} - Current object instance
     */
    open(path = "/") {
        // TODO исп. деструктуризацию
        let fullPath = path;
        let aPath = path.split("/");
        path = "/" + aPath[1];

        if (!this._routes[path]) {
            errorHandler("no such path is registred");
            return;
        }

        if (this._routes[path].viewEntity === null) {
            this._routes[path].viewEntity = new this._routes[path].View();
        }

        if (aPath[2]) {
            Emitter.emit("leaderboard-set-page", aPath[2]); // TODO check рабоатет ли
        }

        window.history.pushState({lastRoute: this._currentRoute}, "", fullPath);
        this._currentRoute = path;

        if (!this._routes[path].viewEntity.isShown) {
            Object.values(this._routes).forEach(function ({viewEntity}) {
                if (viewEntity && viewEntity.isShown) {
                    viewEntity.hide();
                }
            });

            this._routes[path].viewEntity.show();
        } else {
            if (path === this._currentRoute) {
                this.rerender();
            }
        }

        return this;
    }


    rerender() {
        this._routes[this._currentRoute].viewEntity.show();
    }

    getPathTo(View) {
        for (let key in Object.getOwnPropertyNames(this._routes)) {
            if (this._routes[key].View === View) {
                return key;
            }
        }
    }
}

export default new Router();

window.addEventListener('popstate', function (event) {
    event.preventDefault();

    if (event.state.lastRoute) {
        router.open(event.state.lastRoute);
    }

});