import Line from "./Line.js";

export default class SceneLine extends Line {

    draw(context) {
        context.save();

        context.lineWidth = 20;
        context.lineCap = 'round';
        context.lineJoin = 'round';

        context.strokeStyle = "red";

        context.beginPath();

        for (let i = 0; i < this._beginLine.size(); i++) {
            let point = this._beginLine.getRealPoint(i);
            if (point) {
                context.lineTo(point.x, point.y);
            }
        }
        context.stroke();
        context.strokeStyle = "blue";
        context.beginPath();
        if (this._endLine) {
            for (let i = 0; i < this._endLine.size(); i++) {
                let point = this._endLine.getRealPoint(i);
                if (point) {
                    context.lineTo(point.x, point.y);
                }
            }
        }
        context.stroke();

        context.strokeStyle = "black";
        context.beginPath();

        for (let i = this._beginLine.currentPosition; i < this._beginLine.size(); i++) {
            let point = this._beginLine.getRealPoint(i);
            if (point) {
                context.lineTo(point.x, point.y);
            }
        }
        if (this._endLine) {
            for (let i = 0; i < this._endLine.currentPosition; i++) {
                let point = this._endLine.getRealPoint(i);
                if (point) {
                    context.lineTo(point.x, point.y);
                }
            }
        }

        context.stroke();
        context.restore();
    }
}
