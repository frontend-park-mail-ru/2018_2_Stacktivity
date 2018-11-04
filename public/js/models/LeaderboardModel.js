import Emitter from "../modules/Emitter.js";
import AjaxModule from "../modules/Ajax.mjs";
import {errorHandler} from "../misc.js";

export default class LeaderboardModel {
    constructor() {
        // this._limit = 10;

        this._currentPage = 1;

        Emitter.on("leaderboard-set-page", this.setPage.bind(this), false);
        Emitter.on("leaderboard-next-page", this.nextPage.bind(this), false);
        Emitter.on("leaderboard-prev-page", this.prevPage.bind(this), false);
        Emitter.on("leaderboard-load", this.loadUsers.bind(this))
    }

    nextPage() {
        this._currentPage++;
        this.loadUsers();
    }

    prevPage() {
        if (this._currentPage > 1) {
            this._currentPage--;
        }
        this.loadUsers();
    }

    setPage(page) {
        if (page > 0) {
            this._currentPage = page;
        }
    }

    loadUsers() {
        AjaxModule.doGet({path: `/user/?page=${this._currentPage}`}). // TODO fix to offset limit after back update
            then((resp) => {
                if (resp.status === 200) {
                    return resp.json();
                }

                errorHandler(resp)
                Emitter.emit("error"); // TODO errors
            }).
            then((data) => {
                Emitter.emit("done-leaderboard-load", data)
            });
    }
}