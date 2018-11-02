/** @module components/Menu */


/** Renders menu in the application main page */
export class MenuComponent {

    /** Create the menu component
     *
     * @param root - rootElem element for the menu
     */
    constructor({root = document.body} = {}) {
        this._renderRoot = root;
    }


    /** Render the template into the end of rootElem element */
    render() {
    }
}