import {HeaderComponent} from "../components/Header/Header.mjs";
import {NavigationComponent} from "../components/Nav/Nav.mjs";
import {MenuComponent} from "../components/Menu/Menu.mjs";
import {AjaxModule} from "../modules/ajax.mjs";
import {root} from "../modules/router.mjs";

/**
 * @function createMenu
 * Draws the leaders page
 */
export function createMenu() {
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
			navigation.render("menu");
			menu.render();
		});
}