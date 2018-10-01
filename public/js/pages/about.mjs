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
    let content = document.createElement("main");

    const header = new HeaderComponent({el: root});
    const navigation = new NavigationComponent({el: root});
    const about = new AboutComponent({el: content});

    header.data = {is_page, desc: "About"};
    header.render();

    navigation.render("return_link");

    content.classList.add("page_content");

    about.render();

    root.appendChild(content);
}