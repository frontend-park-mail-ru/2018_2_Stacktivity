"use strict";

import {NavigationComponent} from "./components/Nav/Nav.mjs";
import {LeaderboardComponent} from "./components/Leaderboard/Leaderboard.mjs";
import {MenuComponent} from "./components/Menu/Menu.mjs";
import {HeaderComponent} from "./components/Header/Header.mjs";
import {UserFormComponent} from "./components/UserForm/UserForm.mjs";
import {AjaxModule} from "./modules/ajax.js";
import {AboutComponent} from "./components/About/About.mjs";
import {ProfileComponent} from "./components/Profile/Profile.mjs";


const root = document.getElementById("root");

function switchPage(name, param) {
	root.innerHTML = "";

	if (pages.hasOwnProperty(name)) {
		pages[name](param);
	} else {
		createMenu();
	}
}

function createMenu() {
	const header = new HeaderComponent({el: root});
	const navigation = new NavigationComponent({el: root});
	const menu = new MenuComponent({el: root});

	let is_page = false;

	header.data = {is_page, desc: "No desc"};
	header.render();

	AjaxModule.doGet({path: "/session"})
		.then((resp) => {
			if (resp.status === 200) {
				return resp.json();
			}

			return Promise.reject(new Error("no login"));
		})
		.then(user => {
			navigation.render("menu_auth");
			// аватарка

			let profile_link = document.getElementById("profile_link");
			if (user.avatar) {
				profile_link.innerHTML =
					"<span><img src=\"../" +
					user.avatar + "\" class=\"avatar\" /></span>";
			} else {
				profile_link.innerHTML = `<span>${user.username}</span>`;
			}

			menu.render();
		})
		.catch(err => {
			console.log(err);

			navigation.render("menu");
			menu.render();
		});
}


function createSignUp() {
	const header = new HeaderComponent({el: root});
	const navigation = new NavigationComponent({el: root});

	let is_page = true;

	header.data = {is_page, desc: "Sign Up"};
	header.render();

	AjaxModule.doGet({path: "/session"})
		.then(resp => {
			if (resp.status === 200) {
				return Promise.reject(new Error("You are already registereg and even logged in!"));
			}

			navigation.render("signup");

			let content = document.createElement("main");
			content.classList.add("page_content");

			const signInForm = new UserFormComponent({el: content});
			signInForm.data = {
				id: "signup_form",
				commonError: "Several fixes is required",
				submitText: "Submit",
				fields: [
					{
						name: "username",
						validationType: "validate_username",
						type: "text",
						placeholder: "Username",
						error: "Username must be bigger than 3 and less than 20 " +
							"symbols and shouldn\'t contain anything bad"
					},
					{
						name: "email",
						validationType: "validate_email",
						type: "email",
						placeholder: "E-Mail",
						error: "This is not an e-mail"
					},
					{
						name: "password1",
						validationType: "passwordValidate",
						type: "password",
						placeholder: "Password",
						error: "Password must be bigger than 6 and less than 36 symbols"
					},
					{
						name: "password2",
						validationType: "passwordValidateRepeat",
						type: "password",
						placeholder: "Confirm password",
						error: "Passwords do not match"
					},
				]
			};
			signInForm.render();

			root.appendChild(content);

			console.log(signInForm.getErrorfield("passwordValidateRepeat"));

			content.addEventListener("submit", function (event) {
				event.preventDefault();

				if (signInForm.frontVadidate()) {
					signInForm.sendData({path: "/user"})
						.then((res) => {
							if (res) {
								switchPage("menu");
							}
						})
						.catch((err) => {
							console.log(err);
							switchPage("menu");
						})
				}
			});
		})
		.catch(err => {
			console.log(err);
			switchPage("menu");
		});
}


function createLogin() {
	const header = new HeaderComponent({el: root});
	const navigation = new NavigationComponent({el: root});

	let is_page = true;

	header.data = {is_page, desc: "Login"};
	header.render();

	AjaxModule.doGet({path: "/session"})
		.then(resp => {
			if (resp.status === 200) {
				return Promise.reject(new Error("You are already logged in!"));
			}
			navigation.render("login");

			let content = document.createElement("main");
			content.classList.add("page_content");

			const loginForm = new UserFormComponent({el: content});
			loginForm.data = {
				id: "login_form",
				commonError: "Wrong user or password",
				submitText: "Login",
				fields: [
					{
						name: "username",
						validationType: "usernameValidate",
						type: "text",
						placeholder: "Username",
					},
					{
						name: "password",
						validationType: "passwordValidate",
						type: "password",
						placeholder: "Password",
					}
				]
			};
			loginForm.render();

			root.appendChild(content);

			content.addEventListener("submit", function (event) {
				event.preventDefault();

				if (loginForm.frontVadidate()) {
					loginForm.sendData({path: "/session"})
						.then((res) => {
							if (res) {
								switchPage("menu");
							}
						})
						.catch((err) => {
							console.log(err);
							switchPage("menu");
						});
				}
			});
		})
		.catch(err => {
			console.log(err);
			switchPage("menu");
		});
}


function createLeaderboard(page) {
	let is_page = true;

	const header = new HeaderComponent({el: root});
	const navigation = new NavigationComponent({el: root});

	header.data = {is_page, desc: "Leaderboard"};
	header.render();

	navigation.render("leaderboard");

	if (!page || page <= 0) {
		page = 1;
	}

	AjaxModule.doGet({path: `/user/?page=${page}`})
		.then(resp => {
			if (resp.status === 200) {
				return resp.json();
			}

			return Promise.reject(new Error(resp.status));
		})
		.then(data => {
			let content = document.createElement("main");
			content.classList.add("page_content");

			const leaderboard = new LeaderboardComponent({el: content});

			leaderboard.data = {
				users: data
			};
			leaderboard.render();

			root.appendChild(content);


			document.getElementById("prev_page_link").addEventListener('click', (event) => {
				event.preventDefault();
				event.stopImmediatePropagation();
				page -= 1;

				console.log(page);
				switchPage("leaderboard", page);

			});

			document.getElementById("next_page_link").addEventListener('click', (event) => {
				event.preventDefault();
				event.stopImmediatePropagation();
				page += 1;

				console.log(page);
				switchPage("leaderboard", page);
			});

		})
		.catch(err => {
			console.log(err);
			switchPage("menu");
		});
}


function createAbout() {
	let is_page = true;
	const header = new HeaderComponent({el: root});
	header.data = {is_page, desc: "About"};
	header.render();

	const navigation = new NavigationComponent({el: root});
	navigation.render("about");

	let content = document.createElement("main");
	content.classList.add("page_content");

	const about = new AboutComponent({el: content});
	about.render();

	root.appendChild(content);
}


function createProfile() {
	let is_page = true;
	const header = new HeaderComponent({el: root});
	header.data = {is_page, desc: "Profile"};
	header.render();

	const navigation = new NavigationComponent({el: root});
	navigation.render("profile");

	AjaxModule.doGet({path: "/session"})
		.then((resp) => {
			if (resp.status === 200) {
				return resp.json();
			}

			return Promise.reject(new Error("no login"));
		})
		.then(user => {
			let content = document.createElement("main");
			content.classList.add("page_content");

			const profile = new ProfileComponent({el: content});
			profile.data = user;
			profile.render();

			root.appendChild(content);

			content.addEventListener("submit", (event) => {
				event.preventDefault();
				profile.sendData()
					.then(() => {
						switchPage("profile");
					})
					.catch((err) => {
						console.log(err);
						switchPage("menu");
					});
			});

		})
		.catch(err => {
			console.log(err);
			switchPage("menu");
		});
}

const pages = {
	menu: createMenu,
	signup: createSignUp,
	login: createLogin,
	leaderboard: createLeaderboard,
	about: createAbout,
	profile: createProfile
};

createMenu();

root.addEventListener("click", function (event) {
	console.log(event.target);

	let link = event.target;

	if (!(link instanceof HTMLAnchorElement)) {
		link = link.closest("a");

		if (!link) {
			return;
		}
	}

	event.preventDefault();

	console.log({
		href: link.href,
		dataHref: link.dataset.href
	});

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
				console.log(err);
				switchPage("menu");
			});
	} else {
		switchPage(link.dataset.href);
	}
});

