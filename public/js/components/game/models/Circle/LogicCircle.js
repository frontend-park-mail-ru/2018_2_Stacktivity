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

    isIntersectedWithPoint(point) {
        return (point.x - this.c.x) * (point.x - this.c.x) +
               (point.y - this.c.y) * (point.y - this.c.y) <= this.r * this.r;
    }

    isIntersectedWithЫegment(p1, p2) {
        if (Math.min(p1.x, p2.x, this.c.x + this.r) === this.c.x + this.r ||
            Math.max(p1.x, p2.x, this.c.x - this.r) === this.c.x - this.r ||
            Math.min(p1.y, p2.y, this.c.y + this.r) === this.c.y + this.r ||
            Math.max(p1.y, p2.y, this.c.y - this.r) === this.c.y - this.r) {
            return false;
        }
        if (p1.x === p2.x) {
            return true;
        }

        if (p1.x > p2.x) {
            const tmp = p2;
            p2 = p1;
            p1 = tmp;
        }

        //ax + by + c = 0 line from 2 points
        const b = -1;
        const a = (p2.y - p1.y) / (p2.x - p1.x);
        const c = p1.y - a * p1.x;

        // dist = |a*x0 + b*y0 + c| / sqrt(a^2 + b^2) between line and this center
        const dist = Math.abs(a * this.c.x + b * this.c.y + c) / Math.sqrt(a * a + b * b);

        return dist <= this.r;
    }
}