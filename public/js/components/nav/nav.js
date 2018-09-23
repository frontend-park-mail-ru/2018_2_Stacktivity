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

	_render () {
		this._el.innerHTML += Handlebars.templates.nav(this._data);

		// важно, без этого переходы не работают!
		this._data.links.forEach(function (el) {
			document.getElementById(el.id).dataset.href = el.href;
		});

	}
}

