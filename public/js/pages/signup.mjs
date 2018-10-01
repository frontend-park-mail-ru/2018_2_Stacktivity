import {HeaderComponent} from "../components/Header/Header.mjs";
import {NavigationComponent} from "../components/Nav/Nav.mjs";
import {AjaxModule, errorHandler} from "../modules/ajax.mjs";
import {UserFormComponent} from "../components/UserForm/UserForm.mjs";
import {root, router} from "../modules/router.mjs";

/**
 * @function createSignUp
 * Draws the signup page
 */
export function createSignUp() {
    const header = new HeaderComponent({el: root});
    const navigation = new NavigationComponent({el: root});

    let is_page = true;

    header.data = {is_page, desc: "Sign Up"};
    header.render();

    AjaxModule.doGet({path: "/session"}).then((resp) => {
        if (resp.status === 200) {
            return Promise.reject(new Error("You are already registered and even logged in!"));
        }

        navigation.render("signup");

        let content = document.createElement("main");
        content.classList.add("page_content");

        const signInForm = new UserFormComponent({el: content});
        signInForm.data = {
            id: "signup_form",
            commonError: "Several fixes is required",
            submitText: "Submit",
            fields: [
                {
                    name: "username",
                    validationType: "validate_username",
                    type: "text",
                    placeholder: "Username",
                    error: "Username must be bigger than 3 and less than 20 " +
                        "symbols and shouldn't contain anything bad"
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
                    error: "Password must be bigger than 6 and less than 36 symbols"
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
        signInForm.render();

        root.appendChild(content);

        content.addEventListener("submit", function (event) {
            event.preventDefault();

            if (signInForm.frontValidate()) {
                signInForm.sendData({path: "/user"}).then((res) => {
                    if (res) {
                        router.open("menu");
                    }
                }).
                catch((err) => {
                    errorHandler(err);
                    router.open("menu");
                });
            }
        });
    }).
    catch((err) => {
        errorHandler(err);
        router.open("menu");
    });
}