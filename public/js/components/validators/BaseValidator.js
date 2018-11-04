import Emitter from "../../modules/Emitter.js";

export default class BaseValidator {
    validate(form) {
        Emitter.emit("error", "not implemented");
        return true;
    }
}