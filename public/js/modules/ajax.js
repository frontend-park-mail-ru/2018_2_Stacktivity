const noop = () => null;

const base_path = "http://localhost:3001";

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

	static _ajax_xhr({callback = noop, method = "GET", path = "/", body} = {}) {
		const xhr = new XMLHttpRequest();
		xhr.open(method, path, true);
		xhr.withCredentials = true;

		if (body) {
			xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		}

		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4) {
				return;
			}

			callback(xhr);
		};

		if (body) {
			xhr.send(JSON.stringify(body));
		} else {
			xhr.send();
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
}