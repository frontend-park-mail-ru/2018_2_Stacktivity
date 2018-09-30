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

function switchPage(name) {
	if (pages.hasOwnProperty(name)) {
		root.innerHTML = "";
		pages[name]();
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

	AjaxModule.doGet({path: "/me"})
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

	AjaxModule.doGet({path: "/me"})
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

			const signUpForm = new UserFormComponent({el: content});
            signUpForm.data = {
				id: "signup_form",
				commonError: "Several fixes is required",
				submitText: "Submit",
				fields: [
					{
						name: "username",
						validationType: "validate_username",
						type: "text",
						placeholder: "Username",
						error: "Username must be bigger than 4 and less than 20 " +
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
						validationType: "validate_password",
						type: "password",
						placeholder: "Password",
						error: "Password must be bigger than 4 and less than 20 symbols"
					},
					{
						name: "password2",
						validationType: "validate_password_repeat",
						type: "password",
						placeholder: "Confirm password",
						error: "Passwords do not match"
					},
				]
			};
            signUpForm.render();

			root.appendChild(content);

			content.addEventListener("submit", function (event) {
				event.preventDefault();
				console.log("debug sign up", signUpForm.getObject());

				if (!signUpForm.frontVadidate()) return;


				AjaxModule.doPost({path: "/user", body: signUpForm.getObject()})
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

	AjaxModule.doGet({path: "/me"})
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
						validationType: "validate_username",
						type: "text",
						placeholder: "Username",
					},
					{
						name: "password",
						validationType: "validate_password",
						type: "password",
						placeholder: "Password",
					}
				]
			};
			loginForm.render();

			root.appendChild(content);


			content.addEventListener("submit", function (event) {
				event.preventDefault();
				console.log("debug login", loginForm.getObject());

				if (!loginForm.frontVadidate()) return;

				AjaxModule.doPost({path: "/me", body: loginForm.getObject()})
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


function createLeaderboard() {
	let is_page = true;

	const header = new HeaderComponent({el: root});
	header.data = {is_page, desc: "Leaderboard"};
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


	AjaxModule.doGet({path: "/user"})
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
				users: data,
				pagination: [
					{
						symbol: "<-",
						href: ""
					},
					{
						symbol: "1",
						href: ""
					},
					{
						symbol: "2",
						href: ""
					},
					{
						symbol: "->",
						href: ""
					}
				]
			};
			leaderboard.render();
			root.appendChild(content);
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
		AjaxModule.doDelete({path: "/me"})
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

