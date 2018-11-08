import Router from "./modules/Router.mjs";
import UserModel from "./models/UserModel.js";
import Emitter from "./modules/Emitter.js";

import MenuView from "./views/MenuView.js";
import ProfileView from "./views/ProfileView.mjs";
import RegisterView from "./views/RegisterView.mjs";
import LoginView from "./views/LoginView.mjs";
import AboutView from "./views/AboutView.mjs";
import LeaderboardView from "./views/LeaderboardView.mjs";
import GameView from "./views/GameView.js";

import InfoHandler from "./components/InfoHandler.js";

// webpack imports
import "./handlebars.precompile.js";
import "../styles/style.css";
import SingleGameView from "./views/SingleGameView.js";
import MultGameView from "./views/MultGameView.js";

const user = UserModel;
const infoHand = InfoHandler;


Emitter.on("server-validation-error", function (message) {
    let commonErrorEl = document.getElementsByClassName("js-common_error")[0];

    commonErrorEl.innerText = message;
    commonErrorEl.classList.remove("hidden");
});


Handlebars.registerPartial('NavList', Handlebars.templates.NavList);

/**
 * Starts the application
 * @return {undefined}
 */
function main() {
    Router.
        add("/about", AboutView).
        add("/single", SingleGameView).
        add("/mult", MultGameView).
        add("/", MenuView).
        add("/profile", ProfileView).
        add("/signup", RegisterView).
        add("/login", LoginView).
        add("/leaderboard", LeaderboardView);

    Router.open(window.location.pathname);

}

main();