export default class User {
    constructor({nickname, maxLevel, currentLevel}) {
        this._nickname = nickname;
        this._maxLevel = maxLevel;
        this._curLevel = currentLevel;
        this._currentLevel = currentLevel;
    }

    get nickname() {
        return this._nickname;
    }

    set nickname(value) {
        this._nickname = value;
    }

    get maxLevel() {
        return this._maxLevel;
    }

    set maxLevel(value) {
        this._maxLevel = value;
    }

    get currentLevel() {
        return this._currentLevel;
    }

    set currentLevel(value) {
        if (value > this._maxLevel) {
            this._maxLevel = value;
        }
        this._currentLevel = value;
    }
}