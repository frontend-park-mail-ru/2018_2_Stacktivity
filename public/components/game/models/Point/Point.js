export default class Point {
    constructor(x, y) {
        this._x = x || 0.0;
        this._y = y || 0.0;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    static sum(a, b) {
        return new Point(a.x + b.x, a.y + b.y);
    }

    static equal(a, b) {
        return a.x === b.x && a.y === b.y;
    }

    copy() {
        return new Point(this._x, this._y);
    }
}