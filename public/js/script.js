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
	if (pages.hasOwnProperty(name)) {
		root.innerHTML = "";
		pages[name](param);
	} else {
		root.innerHTML = "";
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
			navigation.data = {
				links: [
					{
						content: "About",
						class: ["medium", "sea_blue"],
						id: "about_link",
						href: "about",
					},
					{
						content: "Logout",
						class: ["small", "grey"],
						id: "logout_link",
						href: "logout",
					},
					{
						content: user.username, // вместо аватарки
						class: ["big", "red"],
						id: "profile_link",
						href: "profile",
					}
				]
			};

			navigation.render();

			// аватарка

			if (user.avatar) {
				document.getElementById("profile_link").innerHTML =
					"<span><img src=\"../" +
					user.avatar + "\" class=\"avatar\" /></span>";
			}


			menu.render();
		})
		.catch(err => {
			console.log(err);

			navigation.data = {
				links: [
					{
						content: "About",
						class: ["medium", "sea_blue"],
						id: "about_link",
						href: "about",
					},
					{
						content: "Login",
						class: ["small", "green"],
						id: "login_link",
						href: "login",
					},
					{
						content: "Sign up",
						class: ["big", "red"],
						id: "signup_link",
						href: "signup",
					},
				]
			};

			navigation.render();
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

			navigation.data = {
				links: [
					{
						content: "Login",
						class: ["small", "green", "page"],
						id: "login_link",
						href: "login",
					},
					{
						content: "<-",
						class: ["tiny", "grey"],
						id: "return_link",
						href: "/",
					}
				]
			};
			navigation.render();

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
						validationType: "usernameValidate",
						type: "text",
						placeholder: "Username",
						error: "Username must be bigger than 3 and less than 20 " +
							"symbols and shouldn\'t contain anything bad"
					},
					{
						name: "email",
						validationType: "emailValidate",
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
				console.log("debug sign up", signInForm.getObject());

				signInForm.frontVadidate();


				AjaxModule.doPost({path: "/user", body: signInForm.getObject()})
					.then(resp => {
						if (resp.status === 201 || resp.status === 400) {
							return resp.json();
						}

						if (resp.status === 500) {
							return Promise.reject(new Error(resp.status));
						}
					})
					.then(data => {
						if (data.ValidateSuccess) {
							switchPage("menu");
						} else {
							// TODO нормальная валидация ошибок!
							Array.from(document.getElementsByClassName("error"))
								.forEach(function (elem) {
									elem.classList.remove("hidden");
								});
						}
					})
					.catch(err => {
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

			navigation.data = {
				links: [
					{
						content: "Sign up",
						class: ["big", "red", "page"],
						id: "signup_link",
						href: "signup",
					},
					{
						content: "<-",
						class: ["tiny", "grey"],
						id: "return_link",
						href: "/",
					}
				]
			};
			navigation.render();

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


			console.log(document.getElementById("passwordValidate"));

			console.log();

			content.addEventListener("submit", function (event) {
				event.preventDefault();
				console.log("debug login", loginForm.getObject());

				loginForm.frontVadidate();

				AjaxModule.doPost({path: "/session", body: loginForm.getObject()})
					.then(resp => {
						if (resp.status === 201 || resp.status === 400) {
							return resp.json();
						}

						if (resp.status === 500) {
							return Promise.reject(new Error(resp.status));
						}
					})
					.then(data => {
						if (data.ValidateSuccess) {
							switchPage("menu");
						} else {
							// TODO нормальная валидация ошибок!
							Array.from(document.getElementsByClassName("error"))
								.forEach(function (elem) {
									elem.classList.remove("hidden");
								});
						}
					})
					.catch(err => {
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


function createLeaderboard(page) {
	let is_page = true;

	const header = new HeaderComponent({el: root});
	const navigation = new NavigationComponent({el: root});

	header.data = {is_page, desc: "Leaderboard"};
	header.render();

	navigation.data = {
		links: [
			{
				content: "<-",
				class: ["tiny", "grey"],
				id: "return_link",
				href: "/",
			}
		]
	};
	navigation.render();

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
	navigation.data = {
		links: [
			{
				content: "<-",
				class: ["tiny", "grey"],
				id: "return_link",
				href: "/",
			}
		]
	};
	navigation.render();

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
	navigation.data = {
		links: [
			{
				content: "<-",
				class: ["tiny", "grey"],
				id: "return_link",
				href: "/",
			}
		]
	};
	navigation.render();

	let content = document.createElement("main");
	content.classList.add("page_content");

	const profile = new ProfileComponent({el: content});
	profile.render();

	root.appendChild(content);
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

