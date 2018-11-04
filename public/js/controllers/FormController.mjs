import Emitter from "../modules/Emitter.js";

export default class FormController {
    constructor(formName, Validator = null) {
        if (Validator) {
            this._validator = new Validator();
        }

        this._formName = formName;

    }

    callbackSubmit(event) {
        event.preventDefault();
        console.log(this);

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

        Emitter.emit("submit-data-" + this._formName, data);
    }
}