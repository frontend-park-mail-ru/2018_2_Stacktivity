import {AjaxModule} from "../../modules/ajax.mjs";

/** @module components/UserForm */


/** Renders input forms */
export class UserFormComponent {

    /** Create the header component
     *
     * @param el - root element for the form
     */
    constructor({el = document.body} = {}) {
        this._el = el;
    }

    /** Get data object which will be used when render
     *
     * @return {Object}
     */
    get data() {
        return this._data;
    }

    /** Set data object which will be used when render
     *
     * @param {Object} data
     */
    set data(data) {
        this._data = data;
    }

    /** Render the template into the end of root element */
    render() {
        if (!this._data) {
            return;
        }
        this._render();
    }

    /** Get DOM field that contains error message
     *
     * @param {string} name of input field is linked with the error
     *
     * @return {Object} error field
     */
    getErrorfield(name) {
        for (const elem of document.getElementById(this._data.id).
            getElementsByClassName("validate")) {
            if (elem.getElementsByTagName("input")[0].classList.contains(name)) {
                return elem.getElementsByClassName("error")[0];
            }
        }
    }

    /** Get DOM form field
     *
     * @return {Object} form field
     */
    getObject() {
        return Array.from(document.getElementById(this._data.id).elements).
            reduce((acc, val) => {
                if (val.value !== "") {
                    acc[val.name] = val.value;
                }
                return acc;
            }, {}); // harvesting values from form into the object
    }

    /** Validate form input and activate/deactivate error message
     *
     * @return {boolean} is input valid?
     */
    frontValidate() {
        let isValid = true;
        const isLogin = this._data.id === "login_form";
        const formElem = document.getElementById(this._data.id);
        for (const elem of formElem.getElementsByClassName("validate")) {
            let input = elem.getElementsByTagName("input")[0];
            let err = elem.getElementsByClassName("error")[0];
            if (input.classList.contains("validate_username")) {
                const isValidField = this._usernameValidate(input.value);

                if (!isLogin) {
                    this._switchShowingError(err, isValidField);
                }

                isValid = isValidField ? isValid : false;
            }
            if (input.classList.contains("validate_email")) {
                const isValidField = this._emailValidate(input.value);

                if (!isLogin) {
                    this._switchShowingError(err, isValidField);
                }

                isValid = isValidField ? isValid : false;
            }
            if (input.classList.contains("validate_password")) {
                const isValidField = this._passwordValidate(input.value);

                if (!isLogin) {
                    this._switchShowingError(err, isValidField);
                }

                isValid = isValidField ? isValid : false;
            }
            if (input.classList.contains("validate_password_repeat")) {
                const password1 = document.getElementsByClassName("validate_password");
                const isValidField = this._doublePasswordValidate(password1[0].value, input.value);

                if (!isLogin) {
                    this._switchShowingError(err, isValidField);
                }

                isValid = isValidField ? isValid : false;
            }
        }

        if (isLogin && !isValid) {
            formElem.getElementsByClassName("common_error")[0].
                classList.remove("hidden");
        }

        return isValid;
    }

    /** Validate form by server response
     *
     * @param {Object} data about validation from server
     *
     * @return {boolean} error field
     */
    serverValidate(data) {
        if (data.ValidateSuccess) {
            return true;
        }

        if (this._data.id === "login_form") {
            document.getElementsByClassName("common_error")[0].
                classList.remove("hidden");
            return false;
        }

        if (data.usernameValidate.success) {
            this._switchShowingError(this.getErrorfield("validate_username"), true);
        } else {
            this._switchShowingError(this.getErrorfield("validate_username"), false);
        }
        if (data.emailValidate.success) {
            this._switchShowingError(this.getErrorfield("validate_email"), true);
        } else {
            this._switchShowingError(this.getErrorfield("validate_email"), false);
        }
        if (data.passwordValidate.success) {
            this._switchShowingError(this.getErrorfield("validate_password"), true);
        } else {
            this._switchShowingError(this.getErrorfield("validate_password"), false);
        }
        if (data.passwordRepeatValidate.success) {
            this._switchShowingError(this.getErrorfield("validate_password_repeat"), true);
        } else {
            this._switchShowingError(this.getErrorfield("validate_password_repeat"), false);
        }

        return false;
    }

    /** HTTP action that sends updated profile data
     *
     * @param {Object} params from form
     *
     * @return {Promise}
     */
    sendData(params = {}) {
        return AjaxModule.doPost({...params, body: this.getObject()}).
            then((resp) => {
                if (resp.status === 201 || resp.status === 400) {
                    return resp.json();
                }

                if (resp.status === 500) {
                    return Promise.reject(new Error(resp.status));
                }
            }).
            then((data) => {
                if (this.serverValidate(data)) {
                    return Promise.resolve();
                }
            });
    }

    /** Render the template into the end of root element */
    _render() {
        this._el.innerHTML += Handlebars.templates.UserForm(this._data);
    }

    /** Validate string on correct symbols
     *
     * @param {string} word for validate
     *
     * @return {boolean} is valid?
     */
    _hasCorrectSymbols(word) {
        const CORRECT_PATTERN = /^[-0-9a-z@_\-.]+$/i;
        return CORRECT_PATTERN.test(word);
    }

    /** Validate string on correct length
     *
     * @param {string} word ro validate
     *
     * @return {boolean} is valid?
     */
    _hasCorrectLendth(word) {
        const MIN_LEN = 4;
        const MAX_LEN = 20;

        const len = word.length;
        return len >= MIN_LEN && len <= MAX_LEN;
    }

    /** Validate username
     *
     * @param {string} username for validate
     *
     * @return {boolean} is valid?
     */
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

    /** Validate username
     *
     * @param {string} email for validate
     *
     * @return {boolean} is valid?
     */
    _emailValidate(email) {
        const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = true;
        if (!EMAIL_PATTERN.test(email)) {
            isValid = false;
        }

        return isValid;
    }

    /** Validate username
     *
     * @param {string} password for validate
     *
     * @return {boolean} is valid?
     */
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

    /** Validate username
     *
     * @param {string} password1, password2 for validate
     *
     * @return {boolean} is valid and matched?
     */
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

    /** Validate username
     *
     * @param {Object, boolean} err - field in DOM with error message;
     * isValid - activate/deactivate
     */
    _switchShowingError(err, isValid) {
        if (isValid) {
            err.classList.add("hidden");
        } else {
            err.classList.remove("hidden");
        }
    }
}