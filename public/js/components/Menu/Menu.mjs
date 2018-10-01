/** @module components/Menu */


/** Renders menu in the application main page */
export class MenuComponent {

    /** Create the menu component
     *
     * @param el - root element for the menu
     */
    constructor({el = document.body} = {}) {
        this._el = el;
    }


    /** Render the template into the end of root element */
    render() {
        this._el.innerHTML += Handlebars.templates.Menu();
    }
}