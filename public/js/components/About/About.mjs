export class AboutComponent {
    constructor ({el = document.body} = {}) {
        this._el = el;
    }

    render () {
        this._el.innerHTML += Handlebars.templates.About();
    }
}
