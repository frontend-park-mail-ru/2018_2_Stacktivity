/**
 * @module views/LeaderboardView
 */

import NavigationController from "../controllers/NavigationController.mjs";
import LeaderboardController from "../controllers/LeaderboardController.mjs";
import BaseView from "./BaseView.js";
import Emitter from "../modules/Emitter.js";
import LeaderboardModel from "../models/LeaderboardModel.js";

/**
 * View of the "Leaderboard" page
 * @class LeaderboardView
 * @extends BaseView
 */
export default class LeaderboardView extends BaseView {
    /**
     * Creates view and registres view events
     */
    constructor() {
        super();
        this._leaderboardModel = new LeaderboardModel(); // handle events
        this._leaderboardController = new LeaderboardController();
        this._navigationController = new NavigationController();
        Handlebars.registerPartial('LeaderboardList', Handlebars.templates.LeaderboardList);

        this.render();
        this.registerEvents();

        Emitter.on("done-leaderboard-fetch", this.renderUsers.bind(this), false);
    }

    /**
     * Emits load event and shows view
     * @return {undefined}
     */
    show() {
        super.show();
        Emitter.emit("leaderboard-load");
    }

    /**
     * Resets page number to 1
     * @return {undefined}
     */
    hide() {
        Emitter.emit("leaderboard-set-page", 1);
        super.hide();
    }

    /**
     * Render this view
     * @return {undefined}
     */
    render() {
        super.render();

        this.viewSection.innerHTML += Handlebars.templates.Header({isPage: true, desc: "Leaderboard"});
        this.viewSection.innerHTML += Handlebars.templates.Nav({
            links: [
                {
                    content: "<-",
                    class: [
                        "circle_size_tiny",
                        "circle_color_grey",
                        "navigation__circle_position_return",
                    ],
                    href: "/",
                }
            ]
        });

        this.viewSection.innerHTML += Handlebars.templates.Leaderboard();

    }

    /**
     * Render list of users
     * @param {Array} users List of users on this page
     * @return {undefined}
     */
    renderUsers(users) {
        this.viewSection.
            getElementsByClassName("leaderboard__body")[0].
            innerHTML = Handlebars.templates.LeaderboardList({users});
    }

    /**
     * Register events for NavigationController and LeaderboardController to handle
     * @return {undefined}
     */
    registerEvents() {
        document.getElementById("prev_page_link").
            addEventListener("click", this._leaderboardController.paginationPrevCallback.bind(this._leaderboardController));
        document.getElementById("next_page_link").
            addEventListener("click", this._leaderboardController.paginationNextCallback.bind(this._leaderboardController));

        this.viewSection.addEventListener("click", this._navigationController.keyPressedCallback.bind(this._navigationController));
    }
}