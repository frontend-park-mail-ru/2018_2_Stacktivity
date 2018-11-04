/** @module components/Leaderboard */

import Emitter from "../modules/Emitter.js";

/** Renders leaderboard table */
export default class LeaderboardController {
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