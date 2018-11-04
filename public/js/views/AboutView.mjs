import BaseView from "./BaseView.js";
import NavigationController from "../controllers/NavigationController.mjs";

export default class AboutView extends BaseView{
    /** Create the about component
     *
     * @param el - rootElem element for the component
     */
    constructor() {
        super();
    }

    show() {
        super.show();
        this.render();
    }

    /** Render the template into the end of rootElem element */
    render() {
        super.render();
        this._navigationController = new NavigationController();

        this.viewSection.innerHTML += Handlebars.templates.Header({isPage: true, desc: "About"});
        this.viewSection.innerHTML += Handlebars.templates.Nav({
            links: [
                {
                    content: "<-",
                    class: ["tiny", "grey", "return_link"],
                    href: "/",
                }
            ]
        });

        // TODO в темплейт?
        let content = document.createElement("main");
        content.innerHTML += Handlebars.templates.About();
        content.classList.add("page_content");
        this.viewSection.appendChild(content);

        this.viewSection.getElementsByClassName("navigation")[0].
            addEventListener("click", this._navigationController.keyPressedCallback);
    }
}