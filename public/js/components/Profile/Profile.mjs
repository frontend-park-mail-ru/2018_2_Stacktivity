/** @module components/Profile */

import {AjaxModule} from "../../modules/ajax.mjs";


/** Renders profile form on the profile page */
export class ProfileComponent {

    /** Create the header component
     *
     * @param root - rootElem element for the component
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


    /** Looks through the form and returns object with from properties {name: value}
     *
     * @return {Object|null}
     */
    getObject() {
        if (!this._data) {
            return null;
        }

        return Array.from(document.getElementById("profile_form").elements).
            reduce((acc, val) => {
                if (val.value !== "") {
                    acc[val.name] = val.value;
                }
                return acc;
            }, {}); // harvesting values from form into the object
    }


    /** HTTP action that sends updated profile data
     *
     * @return {Promise}
     */
    sendData() {
        return AjaxModule.doPut({path: `/user/${this._data.id}`, body: this.getObject()}).
            then((resp) => {
                if (resp.status === 200) {
                    return resp.json();
                }

                return Promise.reject(new Error(resp.status));
            });
    }


    /** Render the template into the end of rootElem element */
    render() {
        if (!this._data) {
            return;
        }

        this._renderRoot.innerHTML += Handlebars.templates.Profile(this._data);
    }
}