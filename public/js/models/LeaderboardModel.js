import Emitter from "../modules/Emitter.js";
import AjaxModule from "../modules/Ajax.mjs";
import {errorHandler} from "../misc.js";

export default class LeaderboardModel {
    constructor() {
        // this._limit = 10;
        Emitter.on("leaderboard-fetch", this.loadUsers.bind(this), false)
    }

    loadUsers(page) {
        AjaxModule.doGet({path: `/user/?page=${page}`}). // TODO fix to offset limit after back update
            then((resp) => {
                if (resp.status === 200) {
                    return resp.json();
                }

                Emitter.emit("error"); // TODO errors
            }).
            then((data) => {
                Emitter.emit("done-leaderboard-fetch", data)
            });
    }
}