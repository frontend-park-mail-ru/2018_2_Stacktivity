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
            }).
            then((data) => {
                if (data.length === 0) {
                    Emitter.emit("leaderboard-open-last");
                } else {
                    data = data.map((user, index) => {
                        if (leaderboardLimit * (page - 1) + index + 1 === 1) {
                            user.first = true;
                        }

                        if (leaderboardLimit * (page - 1) + index + 1 === 2) {
                            user.second = true;
                        }

                        if (leaderboardLimit * (page - 1) + index + 1 === 3) {
                            user.third = true;
                        }

                        user.place = leaderboardLimit * (page - 1) + index + 1;
                        return user;
                    });

                    Emitter.emit("done-leaderboard-fetch", data);
                    Emitter.emit("done-leaderboard-fetch-page", page);
                }
            });
    }
}