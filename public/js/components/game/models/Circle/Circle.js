import Point from "../Point/Point.js";

export default class Circle {
    constructor({num, x, y, r}) {
        this._c = new Point(x, y);
        this._r = r;
        this._num = num || 0;
        this._num = num;
    }


    get num() {
        return this._num;
    }

    set num(value) {
        this._num = value;
    }

    get c() {
        return this._c;
    }

    set c(value) {
        this._c = value;
    }

    get r() {
        return this._r;
    }

    set r(value) {
        this._r = value;
    }

    transformToObject() {
        return {
            num: this._num,
            x: this._c.x,
            y: this._c.y,
            r: this._r
        };
    }

    copy() {
        return new Circle(this.transformToObject());
    }
}
