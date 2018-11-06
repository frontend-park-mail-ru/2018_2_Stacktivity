export default class Circle {
    constructor(c, r) {
        this._c = c;
        this._r = r;
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

    copy() {
        return new Circle(this._c.copy(), this._r);
    }
}
