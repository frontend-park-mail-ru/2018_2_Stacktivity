import {createMenu} from "../pages/menu.mjs";
import {createSignUp} from "../pages/signup.mjs";
import {createLogin} from "../pages/login.mjs";
import {createLeaderboard} from "../pages/leaderboard.mjs";
import {createAbout} from "../pages/about.mjs";
import {createProfile} from "../pages/profile.mjs";
import {AjaxModule} from "./ajax.mjs";

export const root = document.getElementById("root");

export function switchPage(name, param) {
	root.innerHTML = "";

	if (pages.hasOwnProperty(name)) {
		pages[name](param);
	} else {
		createMenu();
	}
}

export const pages = {
	menu: createMenu,
	signup: createSignUp,
	login: createLogin,
	leaderboard: createLeaderboard,
	about: createAbout,
	profile: createProfile
};

root.addEventListener("click", function (event) {

	let link = event.target;

	if (!(link instanceof HTMLAnchorElement)) {
		link = link.closest("a");

		if (!link) {
			return;
		}
	}

	event.preventDefault();

	if (link.dataset.href === "logout") {
		AjaxModule.doDelete({path: "/session"})
			.then(resp => {
				if (resp.status === 200) {
					switchPage("menu");
				} else {
					return Promise.reject(new Error(resp.status));
				}
			})
			.catch(err => {
				switchPage("menu");
			});
	} else {
		switchPage(link.dataset.href);
	}
});

export function start() {
	switchPage("menu");
}