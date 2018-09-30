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

	getObject() {
		return Array.from(document.getElementById(this._data.id).elements).reduce((acc, val) => {
			if (val.value !== "") {
				acc[val.name] = val.value;
			}
			return acc;
		}, {}); // harvesting values from form into the object
	}

	frontVadidate() {
        let isValid = true;
        const isLogin = this._data.id === "login_form";
        const formElem = document.getElementById(this._data.id);

	    for (const elem of formElem.getElementsByClassName("validate")) {
	        let input = elem.getElementsByTagName("input")[0];
            let err = elem.getElementsByClassName("error")[0];

            console.log("Validate " + input.name + ": " + input.value);

	        if (input.classList.contains("validate_username")) {
	            if (!this._usernameValidate(input.value)) {
	                if (!isLogin)
                        err.classList.remove("hidden");

                    isValid = false;
                } else {
                    if (!isLogin)
	                    err.classList.add("hidden");
                }
            }
            if (input.classList.contains("validate_email")) {
                if (!this._emailValidate(input.value)) {
                    if (!isLogin)
                        err.classList.remove("hidden");

                    isValid = false;
                } else {
                    if (!isLogin)
                        err.classList.add("hidden");
                }
            }
            if (input.classList.contains("validate_password")) {
                if (!this._passwordValidate(input.value)) {
                    if (!isLogin)
                        err.classList.remove("hidden");

                    isValid = false;
                } else {
                    if (!isLogin)
                        err.classList.add("hidden");
                }
            }
            if (input.classList.contains("validate_password_repeat")) {
                const password1 = document.getElementsByClassName(
                    "validate_password");
                if (!this._doublePasswordValidate(password1[0].value,
                    input.value)) {
                    if (!isLogin)
                        err.classList.remove("hidden");
                } else {
                    if (!isLogin)
                        err.classList.add("hidden");
                }
                isValid = false;
            }
        }

        if (isLogin && !isValid) {
            formElem.getElementsByClassName("common_error")[0]
                .classList.remove("hidden");
        }

        return isValid;
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

	_hasCorrectSymbols(word) {
        const CORRECT_PATTERN = /^[-0-9a-z@_\-.]+$/i;
        return CORRECT_PATTERN.test(word);
	}

	_hasCorrectLendth(word) {
		const MIN_LEN = 4;
		const MAX_LEN = 20;

		const len = word.length;
		return len >= MIN_LEN && len <= MAX_LEN;
	}

	_usernameValidate(username) {
		let isValid = true;

		if (!this._hasCorrectSymbols(username)) {
			isValid = false;
		}
        if (!this._hasCorrectLendth(username)) {
            isValid = false;
        }

        return isValid;
	}

	_emailValidate(email) {
        const  EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = true;
        if (!EMAIL_PATTERN.test(email)) {
        	isValid = false;
		}

		return isValid;
	}

	_passwordValidate(password) {
        let isValid = true;

        if (!this._hasCorrectSymbols(password)) {
            isValid = false;
        }
        if (!this._hasCorrectLendth(password)) {
            isValid = false;
        }

        return isValid;
	}

	_doublePasswordValidate(password1, password2) {
		let isValid = true;

		if (!this._passwordValidate(password1)) {
			isValid = false;
		}
		if (!this._passwordValidate(password2)) {
			isValid = false;
		}
        if (password1 !== password2) {
            isValid = false;
		}

		return isValid;
	}
}
