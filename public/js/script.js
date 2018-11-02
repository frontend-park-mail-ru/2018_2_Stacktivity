import {AjaxModule, errorHandler} from "./modules/ajax.mjs";
import {createAbout} from "./views/about.mjs";
import {createLeaderboard} from "./views/leaderboard.mjs";
import {createLogin} from "./views/login.mjs";
import {createMenu} from "./views/menu.mjs";
import {createProfile} from "./views/profile.mjs";
import {createSignUp} from "./views/signup.mjs";
import {router} from "./modules/Router.mjs";


import UserModel from "./models/UserModel.js";
import Emitter from "./modules/Emitter.js";

Emitter.on("get-user", UserModel.Fetch);
Emitter.on("user-logout", UserModel.Logout);

/**
 * @function logoutUser - Action that clears session-id and logges user out
 */

/**
 * @function main - Starts the application
 */
function main() {
    router.
        add("menu", "/", createMenu).
        add("signup", "/signup", createSignUp).
        add("login", "/login", createLogin).
        add("leaderboard", "/leaderboard", createLeaderboard).
        add("about", "/about", createAbout).
        add("profile", "/profile", createProfile).
        add("logout", "/logout", logoutUser);

    let path = window.location.pathname,
        desiredPage = router.getNameByPath(path);

    if (desiredPage === null) {
        router.open();
    } else {
        router.open(desiredPage);
    }
}

main();