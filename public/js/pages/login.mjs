import {HeaderComponent} from "../components/Header/Header.mjs";
import {NavigationComponent} from "../components/Nav/Nav.mjs";
import {AjaxModule} from "../modules/ajax.mjs";
import {UserFormComponent} from "../components/UserForm/UserForm.mjs";
import {switchPage} from "../modules/router.mjs";

export function createLogin() {
	const header = new HeaderComponent({el: root});
	const navigation = new NavigationComponent({el: root});

	let is_page = true;

	header.data = {is_page, desc: "Login"};
	header.render();

	AjaxModule.doGet({path: "/session"})
		.then(resp => {
			if (resp.status === 200) {
				return Promise.reject(new Error("You are already logged in!"));
			}
			navigation.render("login");

			let content = document.createElement("main");
			content.classList.add("page_content");

			const loginForm = new UserFormComponent({el: content});
			loginForm.data = {
				id: "login_form",
				commonError: "Wrong user or password",
				submitText: "Login",
				fields: [
					{
						name: "username",
						validationType: "validate_username",
						type: "text",
						placeholder: "Username",
					},
					{
						name: "password",
						validationType: "validate_password",
						type: "password",
						placeholder: "Password",
					}
				]
			};
			loginForm.render();

			root.appendChild(content);

			content.addEventListener("submit", function (event) {
				event.preventDefault();

				if (loginForm.frontValidate()) {
					loginForm.sendData({path: "/session"})
						.then((res) => {
							if (res) {
								switchPage("menu");
							}
						})
						.catch((err) => {
							switchPage("menu");
						});
				}
			});
		})
		.catch(err => {
			switchPage("menu");
		});
}
