import Line, {BaseLine} from "./Line.js";
import Point from "../Point/Point.js";
import {MAX_LINE_POINTS_LENGTH} from "../../configs/config";


export default class LogicLine extends Line {
    constructor(basePoint, window) {
        super(basePoint);

        this._window = window;
        this._originLine = null;
        this._inputting = true;
        this._isReversed = false;
    }

    get inputting() {
        return this._inputting;
    }

    set inputting(value) {
        this._inputting = value;

        if (!this._inputting) {
            this._originLine = this._beginLine.copy();
            this.constructEndLine();
        }
    }

    finishLine() {
        this._inputting = false;

        if (!this._inputting) {
            this._originLine = this._beginLine.copy();
            this.constructEndLine();
        }
    }

    addPoint(point, relative) {
        if (!this._inputting || Point.equal(point, this.getLastPoint())) {
            return;
        }
        this._beginLine.addPoint(point, relative);
    }

    getLastPoint() {
        return this._beginLine.lastPoint();
    }

    getLastLine() {
        if (this._inputting) {
            const p1 = this._beginLine.getRealPoint(this._beginLine.size() - 1);
            const p2 = this._beginLine.getRealPoint(this._beginLine.size() - 2);

            return {p1, p2};
        }
        const p1 = this._endLine.getRealPoint(this._endLine.currentPosition - 1) ||
            this._beginLine.getRealPoint(this._beginLine.size() - 1);
        const p2 = this._endLine.getRealPoint(this._endLine.currentPosition);
        return {p1, p2};
    }

    step() {
        if (this._inputting) {
            return;
        }
        this._beginLine.currentPosition++;
        this._endLine.currentPosition++;

        if (this._beginLine._currentPosition === this._beginLine.size()) {
            this._beginLine = this._endLine.copy();
            this.constructEndLine();
        }

        return !this.isLineOutOfWindow();
    }

    constructEndLine() {
        let points = this._originLine.copyPoints();
        if (this._isReversed) {
            points.forEach((item) => {
                item.x = -item.x;
            });
        }
        this._endLine = new BaseLine(this._beginLine.getRealPoint(this._beginLine.size() - 1), points);

        const firstIsReversed = this._isReversed;

        for (let i = 1; i < this._endLine.size(); i++) {
            const point = this._endLine.getRealPoint(i);
            if (point.x < 0 || point.x > this._window.width) {
                this._isReversed = !this._isReversed;

                const prePoint = this._endLine.getRealPoint(i - 1);

                const k = (point.y - prePoint.y) / (point.x - prePoint.x);
                const b = point.y - k * point.x;

                const newPoint = new Point();
                if (point.x < 0) {
                    newPoint.x = 0;
                } else {
                    newPoint.x = this._window.width;
                }
                newPoint.y = Math.round(k * newPoint.x + b);

                this._endLine.addPointByInd(newPoint.copy(), i);
                this._endLine.currentPosition++;

                const newAddedPoint = this._endLine.getOriginPoint(i);
                if (firstIsReversed) {
                    newAddedPoint.x = -newAddedPoint.x;
                }
                this._originLine.points.splice(i, 0, newAddedPoint);

                for (let j = i + 1; j < this._endLine.size(); j++) {
                    this._endLine.points[j].x = 2 * this._endLine.points[i].x - this._endLine.points[j].x;
                }
            }
        }
    }

    isLineOutOfWindow() {
        let isOut = true;

        for (let i = this._beginLine.currentPosition; i < this._beginLine.size(); i++) {
            const point = this._beginLine.getRealPoint(i);
            isOut = point.y < 0 || point.y > this._window.height;
            if (!isOut) {
                return isOut;
            }
        }
        for (let i = 0; i < this._endLine.currentPosition; i++) {
            const point = this._endLine.getRealPoint(i);
            isOut = point.y < 0 || point.y > this._window.height;
            if (!isOut) {
                return isOut;
            }
        }

        return isOut;
    }
}
