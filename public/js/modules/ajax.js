const noop = () => null;

export class AjaxModule {
	static _ajax({callback = noop, method = "GET", path = "/", body}) {
		if (method === "GET" || method === "HEAD") {
			return fetch(path, {
				method: method,
				// headers: headers,
				// mode: "cors",
				// credentials: "include",
			})
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
				// mode: "cors",
				// credentials: "include",
			})
		}
	}

	static _ajax_xhr({callback = noop, method = 'GET', path = '/', body} = {}) {
		const xhr = new XMLHttpRequest();
		xhr.open(method, path, true);
		xhr.withCredentials = true;

		if (body) {
			xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
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
		return this._ajax({...params, method: 'GET'});
	}

	static doPost(params = {}) {
		return this._ajax({...params, method: 'POST'});
	}
}