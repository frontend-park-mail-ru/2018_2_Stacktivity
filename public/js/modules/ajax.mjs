/** @module modules/ajax */

import {base_path} from "../config.js";

/**
 * dummy!
 * @return {null}
 */
function noop() {
    return null;
}

/**
 * dummy, latter will be used to handle errors
 * @return {null}
 */
export function errorHandler(error) {
    noop(error);
    return null;
}

/** AjaxModule is providing http requests to the nackend server */
export class AjaxModule {

    /** Basic method that provides async HTTP requests
     *
     * @param method - GET, POST, PUT etc
     * @param path - API path
     * @param body - Request body
     * @return {Promise<Response>}
     * @private
     */
    static _ajax({method = "GET", path = "/", body}) {
        path = base_path + path;

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