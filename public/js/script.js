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
import {errorHandler} from "./misc.js";

UserModel.__data = null;

Emitter.on("error", errorHandler, false);
Emitter.on("server-validation-error", function (data) {
    let commonErrorEl = document.getElementsByClassName("common_error")[0];

    commonErrorEl.innerText = data.error.message;
    commonErrorEl.classList.remove("hidden");
});

Emitter.on("get-user", () => {UserModel.Fetch()}, false);
Emitter.on("check-user-login", () => {UserModel.IsLoggedIn()}, false);

Emitter.on("submit-data-login", (data) => {UserModel.Login(data)}, false);
Emitter.on("submit-data-signup", (data) => {UserModel.Register(data)}, false);
Emitter.on("submit-data-profile", (data) => {UserModel.Update(data)}, false);
Emitter.on("user-logout", () => {UserModel.Logout()}, false);
Emitter.on("wipe-views", () => {
    Router.open("/");
    Router._updateRender();
}, false);

window.addEventListener('popstate', Router.popstateCallback.bind(Router));

/**
 * @function main - Starts the application
 */
function main() {
    Router.
        add("/about", AboutView).
        add("/single", GameView).
        add("/mult", GameView).
        add("/", MenuView).
        add("/profile", ProfileView).
        add("/signup", RegisterView).
        add("/login", LoginView).
        add("/leaderboard", LeaderboardView);

    Router.open(window.location.pathname);
}

main();