import {HeaderComponent} from "../components/Header/Header.mjs";
import {NavigationComponent} from "../components/Nav/Nav.mjs";
import {AboutComponent} from "../components/About/About.mjs";
import {root} from "../modules/router.mjs";

/**
 * @function createAbout
 * Draws the about page
 */
export function createAbout() {
	let is_page = true;
	const header = new HeaderComponent({el: root});
	header.data = {is_page, desc: "About"};
	header.render();

	const navigation = new NavigationComponent({el: root});
	navigation.render("return_link");

	let content = document.createElement("main");
	content.classList.add("page_content");

	const about = new AboutComponent({el: content});
	about.render();

	root.appendChild(content);
}
