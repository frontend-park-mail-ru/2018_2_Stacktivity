/** @module modules/router */

export const root = document.getElementById("root");


/** Router is providing navigation */
class Router {
	/** Create the router */
	constructor() {
		this._routes = {};
		this._currentRoute = null;
	}

	/**
	 * Regester the new action to invoke
	 *
	 * @param {string} name - Name of action
     * @param {string} path - Path to display in navbar
	 * @param {function} action - Action to invore
	 *
	 * @return {Router} - Current object instance
	 */
	add(name, path, action) {
		this._routes[name] = {path, action};
		return this;
	}

	/**
	 * Returns name of the action with given path
	 *
	 * @param {string} path - path string
	 *
	 * @return {string|null} - Name of the action or null
	 */
	getNameByPath(path) {
		for (const name in this._routes) {
			if (this._routes.hasOwnProperty(name) &&
				this._routes[name].path === path) {
				return name;
			}
		}

		return null;
	}

	/**
	 * Executes action by the name
	 *
	 * @param {string} name - name of the action
	 * @param param - argument for action
	 *
	 * @return {Router} - Current object instance
	 */
	open(name = "menu", param) {
		if (this._routes[name]) {
			root.innerHTML = "";
			this._currentRoute = name;

			window.history.pushState({lastRoute: this._currentRoute}, "", this._routes[name].path);
			this._routes[name].action(param);
		}

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

root.addEventListener("click", function (event) {
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