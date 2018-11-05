/** @module components/Leaderboard */

import Emitter from "../modules/Emitter.js";
import Router from "../modules/Router.mjs";

/** Renders leaderboard table */
export default class LeaderboardController {
    constructor() {
        this._currentPage = 1;

        Emitter.on("leaderboard-next-page", this.nextPage.bind(this), false);
        Emitter.on("leaderboard-prev-page", this.prevPage.bind(this), false);
        Emitter.on("leaderboard-set-page", this.setPage.bind(this), false);
        Emitter.on("leaderboard-load", this.loadPage.bind(this), false);
    }

    loadPage() {
        Emitter.emit("leaderboard-fetch", this._currentPage);
    }

    nextPage() {
        this._currentPage++;
        Router.open(`/leaderboard/${this._currentPage}`);
    }

    prevPage() {
        if (this._currentPage > 1) {
            this._currentPage--;
        }
        Router.open(`/leaderboard/${this._currentPage}`);
    }

    setPage(page) {
        if (page > 0) {
            this._currentPage = page;
        }
    }

    paginationNextCallback(event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        Emitter.emit("leaderboard-next-page");
    }

    paginationPrevCallback(event) {
        event.preventDefault();
        event.stopImmediatePropagation();

        Emitter.emit("leaderboard-prev-page");
    }
}