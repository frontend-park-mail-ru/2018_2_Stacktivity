/** @module components/Header */


/** Renders header in the application views (logo, descpiption) */
export class HeaderComponent {

    /** Create the header component
     *
     * @param root - rootElem element for the header
     */
    constructor({root = document.body} = {}) {
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

        this._renderRoot.innerHTML += Handlebars.templates.Header(this._data);
    }
}