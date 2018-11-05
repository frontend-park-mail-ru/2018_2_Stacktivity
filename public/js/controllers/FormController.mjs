/** @module controllers/FormController */

import Emitter from "../modules/Emitter.js";

/**
 * Form controller provides callback for sending forms via events
 * @class FormController
 */
export default class FormController {
    /**
     * Creates the controller, setups the validator
     * @param {string} formName name of the form (is used when emitting events)
     * @param {Class} Validator validator component
     */
    constructor(formName, Validator = null) {
        if (Validator) {
            this._validator = new Validator();
        }

        this._formName = formName;
    }

    /**
     * Callback for view to apply. Takes values from form and passes it through validator if set, then emits event
     * @param {Event} event "submit" event
     * @return {undefined}
     */
    callbackSubmit(event) {
        event.preventDefault();

        if (this._validator && !this._validator.validate(event.target)) {
            return;
        }

        let data = Array.from(event.target.elements).
            reduce((acc, val) => {
                if (val.value !== "" && val.value !== "password_repeat") {
                    acc[val.name] = val.value;
                }
                return acc;
            }, {}); // harvesting values from form into the object

        Emitter.emit(`submit-data-${this._formName}`, data);
    }
}