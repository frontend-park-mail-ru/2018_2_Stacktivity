/** @module components/Header */


/** Renders header in the application pages (logo, descpiption) */
export class HeaderComponent {

    /** Create the header component
     *
     * @param el - root element for the header
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

        this._el.innerHTML += Handlebars.templates.Header(this._data);
    }
}
