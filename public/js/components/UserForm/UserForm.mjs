import {AjaxModule} from "../../modules/ajax.js";

export class UserFormComponent {
	constructor({el = document.body} = {}) {
		this._el = el;
	}

	get data() {
		return this._data;
	}

	set data(data) {
		this._data = data;
	}

	render() {
		if (!this._data) {
			return;
		}

		this._render();
	}

	getErrorfield(name) {
		return document.getElementById(name).getElementsByClassName("error")[0];
	}

	getObject() {
		return Array.from(document.getElementById(this._data.id).elements).reduce((acc, val) => {
			if (val.value !== "") {
				acc[val.name] = val.value;
			}
			return acc;
		}, {}); // harvesting values from form into the object
	}

	frontVadidate() {
		if (this._data.id === "signup_form") {
			let err = this.getErrorfield("passwordValidateRepeat");

			err.classList.remove("hidden");
			err.innerText = "Hello!";

			console.log(this.getErrorfield("passwordValidateRepeat"));
		}

		if (this._data.id === "login_form") {
			let err = this.getErrorfield("passwordValidate");

			err.classList.remove("hidden");
			err.innerText = "Hi!";

			console.log(this.getErrorfield("passwordValidate"));
		}
		// frontend validation

		return true;
	}

	serverValidate(data) {
		// server validation
	}

	sendData(params = {}) {
		return AjaxModule.doPost({...params, body: this.getObject()})
			.then(resp => {
				if (resp.status === 201 || resp.status === 400) {
					return resp.json();
				}

				if (resp.status === 500) {
					return Promise.reject(new Error(resp.status));
				}
			})
			.then(data => {
				if (data.ValidateSuccess) {
					return Promise.resolve();
				} else {
					// TODO нормальная валидация ошибок!
					Array.from(document.getElementsByClassName("error"))
						.forEach(function (elem) {
							elem.classList.remove("hidden");
						});

					return false
				}
			})
	};

	_render() {
		this._el.innerHTML += Handlebars.templates.UserForm(this._data);
	}
}
