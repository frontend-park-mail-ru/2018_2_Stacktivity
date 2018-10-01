/** @module modules/ajax */

import {base_path} from "../config.js";

/** AjaxModule is providing http requests to the nackend server */
export class AjaxModule {
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

	static doGet(params = {}) {
		return this._ajax({...params, method: "GET"});
	}

	static doPost(params = {}) {
		return this._ajax({...params, method: "POST"});
	}

	static doDelete(params = {}) {
		return this._ajax({...params, method: "DELETE"});
	}

	static doPut(params = {}) {
		return this._ajax({...params, method: "PUT"});
	};
}