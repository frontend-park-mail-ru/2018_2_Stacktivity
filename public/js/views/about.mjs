import {HeaderComponent} from "../components/Header/Header.mjs";
import {NavigationComponent} from "../components/Nav/Nav.mjs";
import {AboutComponent} from "../components/About/About.mjs";
import {rootElem} from "../modules/Router.mjs";

/**
 * @function createAbout
 * Draws the about page
 */
export function createAbout() {
    let is_page = true;
    let content = document.createElement("main");

    const header = new HeaderComponent({root: rootElem});
    const navigation = new NavigationComponent({root: rootElem});
    const about = new AboutComponent({root: content});

    header.data = {is_page, desc: "About"};
    header.render();

    navigation.render("return_link");

    content.classList.add("page_content");

    about.render();

    rootElem.appendChild(content);
}