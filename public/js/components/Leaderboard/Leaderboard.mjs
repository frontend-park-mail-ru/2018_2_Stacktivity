/** @module components/Leaderboard */


/** Renders leaderboard table */
export class LeaderboardComponent {

    /** Create the header component
     *
     * @param root - rootElem element for the leaderboard
     */
    constructor({el: root = document.body} = {}) {
        this._renderRoot = root;
    }


    /** Get data object which will be used when render
     *
     * @return {Object}
     */
    get data() {
        return this._data;
    }


    /** Set data object which will be used when render
     *
     * @param {Object} data
     */
    set data(data) {
        this._data = data;
    }


    /** Render the template into the end of rootElem element */
    render() {
        if (!this._data) {
            return;
        }

        this._renderRoot.innerHTML += Handlebars.templates.Leaderboard(this._data);
    }
}