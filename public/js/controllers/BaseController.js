export default class BaseController {
    constructor(View = null) {
        this._ViewClass = View;
        this._view = null;
    }

    // создаём вьюху
    initView() {
        if (!hasView()) {
            return;
        }

        this._view = new this._ViewClass();
    }

    hasView() {
        return this._ViewClass !== null;
    }

    operate() {
        if (this._view === null) {
            initView();
        }

        if (this._view !== null) {
            this._view.show();
        }
    }
}