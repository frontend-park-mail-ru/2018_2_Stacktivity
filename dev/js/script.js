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
import {sw_init} from "./install-sw.js";

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

document.emitter = Emitter;

main();
sw_init();

const rList = [];

const wh = window.innerWidth / window.innerHeight;

if (wh > 2 / 3) {
    for (let i = 0; i < 10; i++) {
        let rounds = document.createElement("div");
        rounds.classList.add("js-circle-animation", "circle", "circle_size_small");
        const rl = Math.random();
        rounds.style.top = `${Math.random() * 100}vh`;

        if (rl < 0.5) {
            rounds.style.left = `${rl * 2 * 20}vw`;
        } else {
            rounds.style.left = `${60 + rl * 30}vw`;
        }

        const rd = 0.4 + Math.random() * 0.6;
        rounds.style.width = `${rd * 30}vmin`;
        rounds.style.height = `${rd * 30}vmin`;
        rounds.style.backgroundColor = `rgba(${230 + Math.random() * 25}, ${230 + Math.random() * 25}, ${230 + Math.random() * 25}, 0.8)`;

        document.getElementById("rootElem").
            appendChild(rounds);
        rList.push(rounds);
    }

    run();
}

let mouse_x = 0;
let mouse_y = 0;

document.getElementById("rootElem").
    addEventListener("mousemove", (event) => {
        mouse_x = event.pageX - event.target.offsetLeft;
        mouse_y = event.pageY - event.target.offsetTop;
    });

function dist(xa, ya, xb, yb) {
    return Math.sqrt((xb - xa) * (xb - xa) + (yb - ya) * (yb - ya));
}

function run() {
    for (let i = 0; i < rList.length; i++) {
        const xc = rList[i].offsetLeft + rList[i].offsetWidth / 2;
        const yc = rList[i].offsetTop + rList[i].offsetHeight / 2;
        const r = rList[i].offsetWidth / 2;

        const d = dist(xc, yc, mouse_x, mouse_y);

        if (d < r + 50) {
            rList[i].ax = (xc - mouse_x) * (r + 50) / (d * 30);
            rList[i].ay = (yc - mouse_y) * (r + 50) / (d * 30);
        }
        if (rList[i].ax > 0) {
            rList[i].ax -= 0.05;
            rList[i].style.left = `${rList[i].offsetLeft + rList[i].ax}px`;

            if (rList[i].ax < 0) {
                rList[i].ax = 0;
            }
        }

        if (rList[i].ax < 0) {
            rList[i].ax += 0.05;
            rList[i].style.left = `${rList[i].offsetLeft + rList[i].ax}px`;

            if (rList[i].ax > 0) {
                rList[i].ax = 0;
            }
        }

        if (rList[i].ay > 0) {
            rList[i].ay -= 0.05;
            rList[i].style.top = `${rList[i].offsetTop + rList[i].ay}px`;

            if (rList[i].ay < 0) {
                rList[i].ay = 0;
            }
        }

        if (rList[i].ay < 0) {
            rList[i].ay += 0.05;
            rList[i].style.top = `${rList[i].offsetTop + rList[i].ay}px`;

            if (rList[i].ay > 0) {
                rList[i].ay = 0;
            }
        }


        for (let j = i + 1; j < rList.length; j++) {
            const jxc = rList[j].offsetLeft + rList[j].offsetWidth / 2;
            const jyc = rList[j].offsetTop + rList[j].offsetHeight / 2;
            const jr = rList[j].offsetWidth / 2;

            const jd = dist(xc, yc, jxc, jyc);

            if (jd < jr + r) {
                rList[j].ax = -(xc - jxc) * 2 / r;
                rList[i].ax = (xc - jxc) * 2 / r;
                rList[j].ay = -(yc - jyc) * 2 / r;
                rList[i].ay = (yc - jyc) * 2 / r;
            }

            if (rList[j].offsetLeft > window.innerWidth - rList[j].offsetWidth) {
                rList[j].style.left = `${window.innerWidth - rList[j].offsetWidth}px`;
            }

            if (rList[j].offsetLeft < 0) {
                rList[j].style.left = `0`;
            }

            if (rList[j].offsetTop > window.innerHeight - rList[j].offsetHeight) {
                rList[j].style.top = `${window.innerHeight - rList[j].offsetHeight}px`;
            }

            if (rList[j].offsetTop < 0) {
                rList[j].style.top = `0`;
            }
        }
    }
    window.requestAnimationFrame(run);
}

document.getElementsByClassName("js-donate_section")[0].style.display = "none";
const don = document.getElementsByClassName("js-donate_link");
if (don) {
    don[0].addEventListener("click", () => {
        event.preventDefault();
        const donate = document.getElementsByClassName("js-donate_section")[0];
        if (donate.style.display === "none") {
            donate.style.display = "block";
        } else {
            donate.style.display = "none";
        }
    });
}