import {HeaderComponent} from "../components/Header/Header.mjs";
import {NavigationComponent} from "../components/Nav/Nav.mjs";
import {AjaxModule, errorHandler} from "../modules/ajax.mjs";
import {LeaderboardComponent} from "../components/Leaderboard/Leaderboard.mjs";
import {rootElem, router} from "../modules/Router.mjs";

/**
 * @function createLeaderboard
 * Draws the leaders page
 * @param {number} page - Number of the page to display
 */
export function createLeaderboard(page) {
    let is_page = true;

    const header = new HeaderComponent({root: rootElem});
    const navigation = new NavigationComponent({root: rootElem});

    header.data = {is_page, desc: "Leaderboard"};
    header.render();

    navigation.render("return_link");

    if (!page || page <= 0) {
        page = 1;
    }

    AjaxModule.doGet({path: `/user/?page=${page}`}).
        then((resp) => {
            if (resp.status === 200) {
                return resp.json();
            }

            return Promise.reject(new Error(resp.status));
        }).
        then((data) => {
            let content = document.createElement("main");
            content.classList.add("page_content");

            const leaderboard = new LeaderboardComponent({root: content});

            leaderboard.data = {
                users: data
            };
            leaderboard.render();

            rootElem.appendChild(content);


            document.getElementById("prev_page_link").
                addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    page -= 1;

                    router.open("leaderboard", page);

                });

            document.getElementById("next_page_link").
                addEventListener('click', (event) => {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    page += 1;

                    router.open("leaderboard", page);
                });

        }).
        catch((err) => {
            errorHandler(err);
            router.open("menu");
        });
}