import Point from "../Point/Point.js";

export default class Line {
    constructor(basePoint) {
        this._beginLine = new BaseLine(basePoint);
        this._endLine = null;
    }

    get beginLine() {
        return this._beginLine;
    }

    set beginLine(value) {
        this._beginLine = value;
    }

    get endLine() {
        return this._endLine;
    }

    set endLine(value) {
        this._endLine = value;
    }

    copyLine() {
        return {
            beginLine: this._beginLine ? this._beginLine.copyWithPosition() : null,
            endLine: this._endLine ? this._endLine.copyWithPosition() : null
        };
    }
}

export class BaseLine {
    constructor(basePoint, points) {
        this._points = points || [new Point()];
        this._basePoint = basePoint || new Point();
        this._currentPosition = 0;
    }


    get basePoint() {
        return this._basePoint;
    }

    set basePoint(value) {
        this._basePoint = value;
    }

    get currentPosition() {
        return this._currentPosition;
    }

    set currentPosition(value) {
        this._currentPosition = value;
    }

    get points() {
        return this._points;
    }

    set points(value) {
        this._points = value;
    }

    size() {
        return this._points.length;
    }

    lastPoint() {
        if (this.size() === 0) {
            return null;
        }
        return this.getRealPoint(this.size() - 1);
    }

    addPoint(point) {
        point.x -= this._basePoint.x;
        point.y -= this._basePoint.y;
        this._points.push(point);
    }

    getRealPoint(index) {
        if (index < 0 || index >= this.size()) {
            return null;
        }
        return Point.sum(this._points[index], this._basePoint);
    }

    copyWithPosition() {
        let newLine = this.copy();
        newLine._currentPosition = this._currentPosition;

        return newLine;
    }

    copy() {
        let newLine = new BaseLine(this.copyBasePoint());
        newLine._points = this.copyPoints();

        return newLine;
    }

    copyPoints() {
        let points = [];
        this._points.forEach((point) => {
            points.push(point.copy());
        });

        return points;
    }

    copyBasePoint() {
        return this._basePoint.copy();
    }
}
