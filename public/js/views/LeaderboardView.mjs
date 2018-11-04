import NavigationController from "../controllers/NavigationController.mjs";
import LeaderboardController from "../controllers/LeaderboardController.mjs";
import BaseView from "./BaseView.js";
import Emitter from "../modules/Emitter.js";
import LeaderboardModel from "../models/LeaderboardModel.js";

export default class LeaderboardView extends BaseView {
    constructor() {
        super();
        this._leaderboardModel = new LeaderboardModel();

        Emitter.on("done-leaderboard-load", this.render.bind(this), false);
    }

    show() {
        super.show();
        Emitter.emit("leaderboard-load");
    }

    render(users) {
        super.render();
        this.viewSection.innerHTML += Handlebars.templates.Header({isPage: true, desc: "Leaderboard"});

        this._navigationController = new NavigationController();
        this._leaderboardController = new LeaderboardController();

        this.viewSection.innerHTML += Handlebars.templates.Nav({
            links: [
                {
                    content: "<-",
                    class: ["tiny", "grey", "return_link"],
                    href: "/",
                }
            ]
        });


        let content = document.createElement("main");
        content.classList.add("page_content");
        content.innerHTML += Handlebars.templates.Leaderboard({users});
        this.viewSection.appendChild(content);

        document.getElementById("prev_page_link").
            addEventListener("click", this._leaderboardController.paginationPrevCallback.bind(this._leaderboardController));
        document.getElementById("next_page_link").
            addEventListener("click", this._leaderboardController.paginationNextCallback.bind(this._leaderboardController));

        this.viewSection.addEventListener("click", this._navigationController.keyPressedCallback.bind(this._navigationController));
    }
}