/**
 * @module models/LeaderboardModel
 */

import Emitter from "../modules/Emitter.js";
import AjaxModule from "../modules/Ajax.mjs";

/**
 * Leaderboard model
 * @class LeaderboardModel
 */
export default class LeaderboardModel {
    /**
     * Creates the model
     */
    constructor() {
        Emitter.on("leaderboard-fetch", this.loadUsers.bind(this), false);
    }

    /**
     * @param {string|number} page Page number
     * @return {Promise} return
     */
    loadUsers(page) {
        return AjaxModule.doGet({path: `/user/?page=${page}`}). // TODO fix to offset limit after back update
            then((resp) => {
                if (resp.status === 200) {
                    return resp.json();
                }

                Emitter.emit("error"); // TODO errors
            }).
            then((data) => {
                Emitter.emit("done-leaderboard-fetch", data);
            });
    }
}