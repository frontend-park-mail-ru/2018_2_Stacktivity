/**
 * @class BaseView
 * @module BaseView
 */
export default class BaseView {
    constructor() {
        this.viewSection = document.createElement('section'); // <section> where the views is rendering to
        BaseView.renderRoot.appendChild(this.viewSection);
        this.viewSection.hidden = true; // View should not be displayed until all preparations is done (like data fetch)
    }

    get isShown() {
        return this.viewSection.hidden === false;
    }

    static get renderRoot() {
        return document.getElementById("rootElem");
    }

    show() {
        this.viewSection.hidden = false;
    }

    hide() {
        this.viewSection.hidden = true;
    }

    render() {
        this.viewSection.innerHTML = "";
        // errorHandler(`View ${this.constructor.name} is not implemented`);
    }
}