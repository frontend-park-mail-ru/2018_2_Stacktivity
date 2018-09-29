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

	getObject() {
		return Array.from(document.getElementById(this._data.id).elements).reduce((acc, val) => {
			if (val.name !== "") {
				acc[val.name] = val.value;
			}
			return acc;
		}, {}); // harvesting values from form into the object
	}

	frontVadidate() {
		// frontend validation

		return true
	}

	serverValidate(data) {
		// server validation
	}

	_render() {
		this._el.innerHTML += Handlebars.templates.UserForm(this._data);
	}
}
