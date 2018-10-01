import {HeaderComponent} from "../components/Header/Header.mjs";
import {NavigationComponent} from "../components/Nav/Nav.mjs";
import {AjaxModule, errorHandler} from "../modules/ajax.mjs";
import {ProfileComponent} from "../components/Profile/Profile.mjs";
import {root, router} from "../modules/router.mjs";

/**
 * @function createProfile
 * Draws the profile page
 */
export function createProfile() {
    let is_page = true;
    const header = new HeaderComponent({el: root});
    header.data = {is_page, desc: "Profile"};
    header.render();

    const navigation = new NavigationComponent({el: root});
    navigation.render("return_link");

    AjaxModule.doGet({path: "/session"}).
        then((resp) => {
            if (resp.status === 200) {
                return resp.json();
            }

            return Promise.reject(new Error("no login"));
        }).
        then((user) => {
            let content = document.createElement("main");
            content.classList.add("page_content");

            const profile = new ProfileComponent({el: content});
            profile.data = user;
            profile.render();

            root.appendChild(content);

            content.addEventListener("submit", (event) => {
                event.preventDefault();
                profile.sendData().
                    then(() => {
                        router.open("profile");
                    }).
                    catch((err) => {
                        errorHandler(err);
                        router.open("menu");
                    });
            });

        }).
        catch((err) => {
            errorHandler(err);
            router.open("menu");
        });
}