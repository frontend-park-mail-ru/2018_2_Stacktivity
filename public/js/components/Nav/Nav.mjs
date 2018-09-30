export class NavigationComponent {
	constructor({el = document.body} = {}) {
		this._el = el;


		this._pageNavigations = {
			menu: {
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
			},

			menu_auth: {
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
						content: "username", // вместо аватарки
						class: ["big", "red"],
						id: "profile_link",
						href: "profile",
					}
				]
			},

			signup: {
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
			},

			login: {
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
			},

			leaderboard: {
				links: [
					{
						content: "<-",
						class: ["tiny", "grey"],
						id: "return_link",
						href: "/",
					}
				]
			},

			about: {
				links: [
					{
						content: "<-",
						class: ["tiny", "grey"],
						id: "return_link",
						href: "/",
					}
				]
			},

			profile: {
				links: [
					{
						content: "<-",
						class: ["tiny", "grey"],
						id: "return_link",
						href: "/",
					}
				]
			},
		};
	}

	render(name) {
		this._render(name);
	}

	_render(name) {
		this._el.innerHTML += Handlebars.templates.Nav(this._pageNavigations[name]);

		// important, links don't work without it!
		this._pageNavigations[name].links.forEach(function (el) {
			document.getElementById(el.id).dataset.href = el.href;
		});

	}
}

