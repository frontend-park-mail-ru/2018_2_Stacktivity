/**
 * @module models/LeaderboardModel
 */

import Emitter from "../modules/Emitter.js";
import AjaxModule from "../modules/Ajax.mjs";
import {leaderboardLimit} from "../config.js";

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
        return AjaxModule.doGet({path: `/user?limit=${leaderboardLimit}&offset=${leaderboardLimit * (page - 1)}`}).
            then((resp) => {
                if (resp.status === 200) {
                    return resp.json();
                }

                if (resp.status === 500) {
                    Emitter.emit("leaderboard-error", "Bad request")
                }
            }).
            then((data) => {
                Emitter.emit("done-leaderboard-fetch", data);
            });
    }
}