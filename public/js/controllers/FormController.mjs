import Emitter from "../modules/Emitter.js";

export default class FormController {
    constructor(formName, useValidation = false) {
        this._formName = formName;
        this._useValidation = useValidation;

        console.log(this)

    }

    callbackSubmit(event) {
        console.log("asdasd");

        event.preventDefault();
        // event.stopImmediatePropagation(?);

        if (!this._useValidation || this.frontValidate(event.target)) {
            let data = Array.from(event.target.elements). // TODO !! будет работать?
            reduce((acc, val) => {
                if (val.value !== "" && val.value !== "password_repeat") {
                    acc[val.name] = val.value;
                }
                return acc;
            }, {}); // harvesting values from form into the object

            Emitter.emit("submit-data-"+this._formName, data);
        }
    }

    frontValidate(form) {
        let isValid = true;
        const isLogin = this._formName === "login";
        for (const elem of form.getElementsByClassName("validate")) {
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
            form.getElementsByClassName("common_error")[0].
                classList.remove("hidden");
        }

        return isValid;
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