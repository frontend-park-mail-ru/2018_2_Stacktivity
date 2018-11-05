/**
 * @module views/AboutView
 */

import BaseView from "./BaseView.js";
import NavigationController from "../controllers/NavigationController.mjs";

/**
 * View of the "About" page
 * @class AboutView
 * @extends BaseView
 */
export default class AboutView extends BaseView {
    /**
     * Creates view and renders it
     */
    constructor() {
        super();
        this._navigationController = new NavigationController();
        this.render();
        this.registerEvents();
    }

    /**
     * Generates html and puts it to this.viewSection
     * @return {undefined}
     */
    render() {
        super.render();

        this.viewSection.innerHTML += Handlebars.templates.Header({isPage: true, desc: "About"});
        this.viewSection.innerHTML += Handlebars.templates.Nav({
            links: [
                {
                    content: "<-",
                    class: ["tiny", "grey", "return_link"],
                    href: "/",
                }
            ]
        });

        this.viewSection.innerHTML += Handlebars.templates.About();

    }

    /**
     * Register events for NavigationController to handle
     * @return {undefined}
     */
    registerEvents() {
        this.viewSection.getElementsByClassName("navigation")[0].
            addEventListener("click", this._navigationController.keyPressedCallback);
    }
}