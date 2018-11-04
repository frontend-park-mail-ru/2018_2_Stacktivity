/** @module modules/ajax */

import {basePath} from "../config.js";

/** AjaxModule is providing http requests to the nackend server */
export default class AjaxModule {
    constructor() {
        if (AjaxModule.__instance) {
            return AjaxModule.__instance;
        }

        AjaxModule.__instance = this;
    }

    /** Basic method that provides async HTTP requests
     *
     * @param method - GET, POST, PUT etc
     * @param path - API path
     * @param body - Request body
     * @return {Promise<Response>}
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
     * Method that shortcuts GET method
     *
     * @param {Object} params - path, body
     * @return {Promise<Response>}
     */
    static doGet(params = {}) {
        return this._ajax({...params, method: "GET"});
    }


    /**
     * Method that shortcuts POST method
     *
     * @param {Object} params - path, body
     * @return {Promise<Response>}
     */
    static doPost(params = {}) {
        return this._ajax({...params, method: "POST"});
    }


    /**
     * Method that shortcuts DELETE method
     *
     * @param {Object} params - path, body
     * @return {Promise<Response>}
     */
    static doDelete(params = {}) {
        return this._ajax({...params, method: "DELETE"});
    }


    /**
     * Method that shortcuts PUT method
     *
     * @param {Object} params - path, body
     * @return {Promise<Response>}
     */
    static doPut(params = {}) {
        return this._ajax({...params, method: "PUT"});
    }
}
