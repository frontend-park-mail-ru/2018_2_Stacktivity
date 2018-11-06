/** @module modules/Ajax */

import {basePath} from "../config.js";

/** AjaxModule is providing http requests to the backend server */
export default class AjaxModule {
    /** Create the module */
    constructor() {
        if (AjaxModule.__instance) {
            return AjaxModule.__instance;
        }

        AjaxModule.__instance = this;
    }

    /**
     * @return {Promise<Response>}
     * Basic method that provides async HTTP requests
     * @param {string} method - GET, POST, PUT etc
     * @param {string} path - API path
     * @param {JSON} body - Request body
     * @private
     */
    static _ajax({method = "GET", path = "/", body}) {
        path = basePath + path;

        if (method === "GET" || method === "HEAD" || method === "DELETE") {
            return fetch(path, {
                method: method,
                mode: "cors",
                credentials: "include",
            });
        } else {
            let headers = {}, sendBody = "";
            if (body) {
                headers = {
                    "Content-Type": "application/json; charset=utf-8",
                };

                sendBody = JSON.stringify(body);
            }

            return fetch(path, {
                method: method,
                headers: headers,
                body: sendBody,
                mode: "cors",
                credentials: "include",
            });
        }
    }


    /**
     * @return {Promise<Response>}
     * Method that shortcuts GET method
     * @param {Object} params - path, body
     */
    static doGet(params = {}) {
        return this._ajax({...params, method: "GET"});
    }


    /**
     * @return {Promise<Response>}
     * Method that shortcuts POST method
     * @param {Object} params - path, body
     */
    static doPost(params = {}) {
        return this._ajax({...params, method: "POST"});
    }


    /**
     * @return {Promise<Response>}
     * Method that shortcuts DELETE method
     * @param {Object} params - path, body
     */
    static doDelete(params = {}) {
        return this._ajax({...params, method: "DELETE"});
    }


    /**
     * @return {Promise<Response>}
     * Method that shortcuts PUT method
     * @param {Object} params - path, body
     */
    static doPut(params = {}) {
        return this._ajax({...params, method: "PUT"});
    }
}
