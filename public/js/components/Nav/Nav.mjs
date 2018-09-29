export class NavigationComponent {
	constructor ({el = document.body} = {}) {
		this._el = el;
	}

	get data () {
		return this._data;
	}

	set data (data) {
		this._data = data;
	}

	render () {
		if (!this._data) {
			return;
		}

		this._render();
	}

	generate_content (data = {}) {
		if (data = {}) {

		}


	}

	_render () {
		this._el.innerHTML += Handlebars.templates.Nav(this._data);

		// important, links don't work without it!
		this._data.links.forEach(function (el) {
			document.getElementById(el.id).dataset.href = el.href;
		});

	}
}

