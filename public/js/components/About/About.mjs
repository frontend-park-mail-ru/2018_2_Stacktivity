/** @module components/About */


/** Renders about page */
export class AboutComponent {

    /** Create the about component
     *
     * @param el - root element for the component
     */
    constructor({el = document.body} = {}) {
        this._el = el;
    }


    /** Render the template into the end of root element */
    render() {
        this._el.innerHTML += Handlebars.templates.About();
    }
}