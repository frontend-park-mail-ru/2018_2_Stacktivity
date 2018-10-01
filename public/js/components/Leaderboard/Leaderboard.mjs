/** @module components/Leaderboard */


/** Renders leaderboard table */
export class LeaderboardComponent {

    /** Create the header component
     *
     * @param el - root element for the leaderboard
     */
    constructor({el = document.body} = {}) {
		this._el = el;
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

    /** Render the template into the end of root element */
    render() {
		if (!this._data) {
			return;
		}

        this._el.innerHTML += Handlebars.templates.Leaderboard(this._data);
	}
}
