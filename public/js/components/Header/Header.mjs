export class HeaderComponent {
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
        this._el.innerHTML += Handlebars.templates.Header(this._data);
    }
}
