/** @module components/validators/LoginRegisterValidator */

import BaseValidator from "./BaseValidator.js";

/**
 * Validatiors for login and registration
 * @class LoginRegisterValidator
 * @extends BaseValidator
 */
export default class LoginRegisterValidator extends BaseValidator {
    /**
     * Uses validation methods on form
     * @param {HTMLFormElement} form form is being validated
     * @return {boolean} is valid?
     */
    validate(form) {
        let isValid = true;
        const isLogin = form.id === "login_form";
        for (const elem of form.getElementsByClassName("js-validate")) {
            let input = elem.getElementsByTagName("input")[0];
            let err = elem.getElementsByClassName("js-error")[0];
            if (input.classList.contains("js-validate_username")) {
                const isValidField = this._usernameValidate(input.value);

                if (!isLogin) {
                    this._switchShowingError(err, isValidField);
                }

                isValid = isValidField ? isValid : false;
            }
            if (input.classList.contains("js-validate_email")) {
                const isValidField = this._emailValidate(input.value);

                if (!isLogin) {
                    this._switchShowingError(err, isValidField);
                }

                isValid = isValidField ? isValid : false;
            }
            if (input.classList.contains("js-validate_password")) {
                const isValidField = this._passwordValidate(input.value);

                if (!isLogin) {
                    this._switchShowingError(err, isValidField);
                }

                isValid = isValidField ? isValid : false;
            }
            if (input.classList.contains("js-validate_password_repeat")) {
                const password1 = document.getElementsByClassName("js-validate_password");
                const isValidField = this._doublePasswordValidate(password1[0].value, input.value);

                if (!isLogin) {
                    this._switchShowingError(err, isValidField);
                }

                isValid = isValidField ? isValid : false;
            }
        }

        if (isLogin && !isValid) {
            form.getElementsByClassName("js-common_error")[0].
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
     * @param {string} password1 for validate
     * @param {string} password2 repeat
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
     * @param {Object|boolean} err - field in DOM with error message;
     * @param {boolean} isValid - activate/deactivate
     * @return {undefined}
     */
    _switchShowingError(err, isValid) {
        if (isValid) {
            err.classList.add("hidden");
        } else {
            err.classList.remove("hidden");
        }
    }
}