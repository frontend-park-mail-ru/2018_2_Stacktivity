/**
 * @class BaseView
 * @module BaseView
 */
import {errorHandler} from "../modules/ajax.mjs";

export class BaseView {
    constructor() {
        this.viewSection = document.createElement('section'); // <section> where the view is rendering to
        BaseView._renderRoot.appendChild(this.viewSection);
        this.viewSection.hidden = true; // View should not be displayed until all preparations is done (like data fetch)
    }

    get isShown() {
        return this.viewSection.hidden === false;
    }

    static get _renderRoot() {
        return document.getElementById("rootElem");
    }

    show() {
        this.viewSection.hidden = false;
    }

    hide() {
        this.viewSection.hidden = true;
    }

    render() {
        errorHandler(`View ${this.constructor.name} is not implemented`);
    }
}