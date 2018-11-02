/** @module components/Nav */

import {router} from "../../modules/Router.mjs";


/** Renders navigation block in the application views */
export class NavigationComponent {

    /** Create the navigation component
     *
     * @param root - rootElem element for the header
     */
    constructor({root = document.body} = {}) {
        this._renderRoot = root;


        this._pageNavigations = {
            menu: {
                links: [
                    {
                        content: "About",
                        class: [
                            "medium",
                            "sea_blue"
                        ],
                        id: "about_link",
                        href: "/about",
                    },
                    {
                        content: "Login",
                        class: [
                            "small",
                            "green"
                        ],
                        id: "login_link",
                        href: "/login",
                    },
                    {
                        content: "Sign up",
                        class: [
                            "big",
                            "red"
                        ],
                        id: "signup_link",
                        href: "/signup",
                    },
                ]
            },

            menu_auth: {
                links: [
                    {
                        content: "About",
                        class: [
                            "medium",
                            "sea_blue"
                        ],
                        id: "about_link",
                        href: "/about",
                    },
                    {
                        content: "Logout",
                        class: [
                            "small",
                            "grey"
                        ],
                        id: "logout_link",
                        href: "/logout",
                    },
                    {
                        content: "username", // вместо аватарки
                        class: [
                            "big",
                            "red"
                        ],
                        id: "profile_link",
                        href: "/profile",
                    }
                ]
            },

            signup: {
                links: [
                    {
                        content: "Login",
                        class: [
                            "small",
                            "green",
                            "page"
                        ],
                        id: "login_link",
                        href: "/login",
                    },
                    {
                        content: "<-",
                        class: [
                            "tiny",
                            "grey"
                        ],
                        id: "return_link",
                        href: "/",
                    }
                ]
            },

            login: {
                links: [
                    {
                        content: "Sign up",
                        class: [
                            "big",
                            "red",
                            "page"
                        ],
                        id: "signup_link",
                        href: "/signup",
                    },
                    {
                        content: "<-",
                        class: [
                            "tiny",
                            "grey"
                        ],
                        id: "return_link",
                        href: "/",
                    }
                ]
            },

            return_link: {
                links: [
                    {
                        content: "<-",
                        class: [
                            "tiny",
                            "grey"
                        ],
                        id: "return_link",
                        href: "/",
                    }
                ]
            },
        };
    }


    /** Render the template to the end of rootElem element and set ups dataset.page of links
     *
     * @param {string} navName - name of the set of links which should be wsed
     */
    render(navName) {
        this._renderRoot.innerHTML += Handlebars.templates.Nav(this._pageNavigations[navName]);

        // important, links don't work without it!
        this._pageNavigations[navName].links.forEach(function (el) {
            let link = document.getElementById(el.id);
            link.dataset.page = router.getNameByPath(el.href);
        });
    }
}