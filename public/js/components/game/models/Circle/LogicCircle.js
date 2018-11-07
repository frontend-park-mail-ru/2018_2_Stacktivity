import Circle from "./Circle.js";

export default class LogicCircle extends Circle {
    constructor({num, x, y, r, type}) {
        super({num, x, y, r});

        this._type = type;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    transformToObject() {
        return super.transformToObject().type = this._type;
    }

    copy() {
        return new LogicCircle(this.transformToObject());
    }
}