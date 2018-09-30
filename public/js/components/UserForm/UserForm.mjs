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
			if (val.name !== "") {
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

	_render() {
		this._el.innerHTML += Handlebars.templates.UserForm(this._data);
	}
}
