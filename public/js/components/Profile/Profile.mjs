import {AjaxModule} from "../../modules/ajax.js";

export class ProfileComponent {
	constructor({el = document.body} = {}) {
		this._el = el;
	}

	get data() {
		return this._data;
	}

	set data(data) {
		this._data = data;
	}

	getObject() {
		return Array.from(document.getElementById("profile_form").elements).reduce((acc, val) => {
			if (val.value !== "") {
				acc[val.name] = val.value;
			}
			return acc;
		}, {}); // harvesting values from form into the object
	}


	sendData() {
		return AjaxModule.doPut({path: `/user/${this._data.id}`, body: this.getObject()})
			.then(resp => {
				if (resp.status === 200) {
					return resp.json();
				}

				return Promise.reject(new Error(resp.status));
			})
			.then(data => {
				return Promise.resolve();
			});
	};

	render() {
		this._el.innerHTML += Handlebars.templates.Profile(this._data);
	}
}
