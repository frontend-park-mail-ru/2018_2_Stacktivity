import Router from "./modules/Router.mjs";
import UserModel from "./models/UserModel.js";
import Emitter from "./modules/Emitter.js";

import MenuView from "./views/MenuView.js";
import ProfileView from "./views/ProfileView.mjs";
import RegisterView from "./views/RegisterView.mjs";
import LoginView from "./views/LoginView.mjs";
import AboutView from "./views/AboutView.mjs";
import LeaderboardView from "./views/LeaderboardView.mjs";

import InfoHandler from "./components/infoblock/InfoHandler.js";

import MultGameView from "./views/MultGameView.js";
import GameView from "./views/GameView";
import ChatView from "./views/ChatView";

// webpack import
import "./handlebars.precompile.js";

const user = UserModel;
const infoHand = InfoHandler;

Emitter.on("server-validation-error", function (message) {
    let commonErrorEl = document.getElementsByClassName("js-common_error")[0];

    commonErrorEl.innerText = message;
    commonErrorEl.classList.remove("hidden");
});

Handlebars.registerPartial('NavList', Handlebars.templates.NavList);
Handlebars.registerPartial('GameFooter', Handlebars.templates.GameFooter);
Handlebars.registerPartial('GameHeader', Handlebars.templates.GameHeader);

/**
 * Starts the application
 * @return {undefined}
 */
function main() {
    Router.
        add("/about", AboutView).
        add("/single", GameView).
        add("/mult", MultGameView).
        add("/", MenuView).
        add("/profile", ProfileView).
        add("/signup", RegisterView).
        add("/login", LoginView).
        add("/chat", ChatView).
        add("/leaderboard", LeaderboardView);

    Router.open(window.location.pathname);

}


main();