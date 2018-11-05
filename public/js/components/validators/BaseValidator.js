/* eslint-disable no-unused-vars */
/** @module components/validators/BaseValidator */

import Emitter from "../../modules/Emitter.js";

/**
 * Validator interface
 * @class BaseValidator
 */
export default class BaseValidator {
    /**
     * Uses validation methods on form
     * @param {HTMLFormElement} form form is being validated
     * @return {boolean} is valid?
     */
    validate(form) {
        Emitter.emit("error", "not implemented");
        return true;
    }
}