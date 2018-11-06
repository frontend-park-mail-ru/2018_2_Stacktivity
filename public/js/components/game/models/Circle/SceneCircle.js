import Circle from "./Circle.js";

export default class SceneCircle extends Circle {
    constructor(circle, color) {
        super(circle.c, circle.r);

        this._color = color;
    }

    get color() {
        return this._color;
    }

    set color(value) {
        this._color = value;
    }

    copy() {
        return new SceneCircle(super.copy(), this._color);
    }

    draw(context) {
        context.save();

        context.beginPath();
        context.arc(this._c.x, this._c.y, this._r, 0, Math.PI * 2, true);
        context.closePath();

        context.fillStyle = this._color;
        context.fill();

        context.restore();
    }
}
