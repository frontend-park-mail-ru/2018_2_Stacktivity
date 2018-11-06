import Circle from "./Circle.js";

export default class LogicCircle extends Circle {
    constructor(circle, type) {
        super(circle.c, circle.r);

        this._type = type;
    }

    get type() {
        return this._type;
    }

    set type(value) {
        this._type = value;
    }

    copy() {
        return new LogicCircle(super.copy(), this._type);
    }
}