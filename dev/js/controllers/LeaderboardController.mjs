/** @module controllers/LeaderboardController */

import Emitter from "../modules/Emitter.js";
import Router from "../modules/Router.mjs";

/**
 * Leaderboard controller provides callbacks for pagination on Leaderboard page
 * @class LeaderboardController
 */
export default class LeaderboardController {
    /**
     * Creates the controller and setups the events on Emitter
     */
    constructor() {
        this._currentPage = 1;
        this._lastContentPage = 1;

        Emitter.on("leaderboard-next-page", this._nextPage.bind(this), false);
        Emitter.on("leaderboard-prev-page", this._prevPage.bind(this), false);
        Emitter.on("leaderboard-set-page", this._setPage.bind(this), false);
        Emitter.on("leaderboard-open-last", this._loadLast.bind(this), false);
        Emitter.on("done-leaderboard-fetch-page", this._updateLast.bind(this), false);
        Emitter.on("leaderboard-load", this._loadPage.bind(this), false);
    }

    /**
     * @return {undefined}
     * Emits event on Leaderboard Model
     * @private
     */
    _loadPage() {
        Emitter.emit("leaderboard-fetch", this._currentPage);
    }

    /**
     * @return {undefined}
     * Emits event on Leaderboard Model
     * @private
     */
    _loadLast() {
        this._currentPage = this._lastContentPage;
        Emitter.emit("leaderboard-fetch", this._lastContentPage);
    }

    /**
     * @return {undefined}
     * @param {string|number} page page number
     * Set page counter to stable
     * @private
     */
    _updateLast(page) {
        document.getElementsByClassName("js-leaderboard-page")[0].innerHTML = page;

        if (this._lastContentPage < page) {
            this._lastContentPage = page;
        }
    }

    /**
     * @return {undefined}
     * Increments page counter and navigates to next page
     * @private
     */
    _nextPage() {
        this._currentPage += 1;
        Router.open(`/leaderboard/${this._currentPage}`);
    }

    /**
     * @return {undefined}
     * Decrements page counter and navigates to prev page if possible
     * @private
     */
    _prevPage() {
        if (this._currentPage > 1) {
            this._currentPage -= 1;
        }
        Router.open(`/leaderboard/${this._currentPage}`);
    }

    /**
     * @return {undefined}
     * @param {string|number} page page number
     * Sets page counter to specific number
     * @private
     */
    _setPage(page) {
        if (page > 0) {
            this._currentPage = Number(page);
        }
    }

    /**
     * @return {undefined}
     * @param {Event} event "click" event
     * Callback for views to apply. Emits next page event
     */
    paginationNextCallback(event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        Emitter.emit("leaderboard-next-page");
    }

    /**
     * @return {undefined}
     * @param {Event} event "click" event
     * Callback for views to apply. Emits prev page event
     */
    paginationPrevCallback(event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        Emitter.emit("leaderboard-prev-page");
    }
}