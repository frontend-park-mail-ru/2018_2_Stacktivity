/**
 * @module views/BaseView
 */

/**
 * Class which provides basic methods for all views
 * @class BaseView
 */
export default class BaseView {
    /**
     * Creates <section> for view to render
     */
    constructor() {
        this.viewSection = document.createElement('section'); // <section> where the views is rendering to
        BaseView.renderRoot.appendChild(this.viewSection);
        this.viewSection.hidden = true; // View should not be displayed until all preparations is done (like data fetch)
    }

    /**
     * Shows if the view is active or not
     * @return {boolean} true is view is not hidden
     */
    get isShown() {
        return this.viewSection.style.display === 'flex';
    }

    /**
     * @return {HTMLElement} the element where all <sections> is placed
     */
    static get renderRoot() {
        return document.getElementById("rootElem");
    }

    /**
     * Unhide the view
     * @return {undefined}
     */
    show() {
        this.viewSection.style.display = 'flex';
    }

    /**
     * Hide the view
     * @return {undefined}
     */
    hide() {
        this.viewSection.style.display = 'none';
    }

    /**
     * Clears this view's render section for next clean render
     * @return {undefined}
     */
    render() {
        this.viewSection.innerHTML = "";
    }
}