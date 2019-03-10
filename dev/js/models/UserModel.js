/**
 * @module models/UserModel
 */

import AjaxModule from "../modules/Ajax";
import Emitter from "../modules/Emitter";

/**
 * User model
 * @class UserModel
 */
export default class UserModel {
    /**
     * @return {UserModel|*}
     * Creates the model
     */
    constructor(noSingleton = false) {
        if (!noSingleton) { // we used singleton, but it can't be used when running async tests
            if (UserModel.__instance) {
                return UserModel.__instance;
            }
        }

        this._data = {};

        if (!noSingleton) { // makes sense when using singleton
            Emitter.on("get-user", this.fetch.bind(this), false);
            Emitter.on("check-user-login", this.isLoggedIn.bind(this), false);
            Emitter.on("submit-data-login", this.login.bind(this), false);
            Emitter.on("submit-data-signup", this.register.bind(this), false);
            Emitter.on("submit-data-profile", this.update.bind(this), false);
            Emitter.on("user-logout", this.logout.bind(this), false);

            UserModel.__instance = this;
        }
    }

    /**
     * @return {*}
     * Get user data from server or return fetched data
     */
    async fetch({doneGetUser = "done-get-user"} = {}) {
        if (this._data.username !== undefined) {
            Emitter.emit(doneGetUser, this._data);
            return;
        }

        if (this._data.is_logged_in === undefined) {
            Emitter.on("done-check-user-login", this.fetch.bind(this));
            Emitter.emit("check-user-login");
            return;
        }

        if (!this._data.is_logged_in) {
            Emitter.emit(doneGetUser, this._data);
        } else {
            await AjaxModule.doGet({path: `/user/${this._data.id}`}).
                then((resp) => {
                    if (resp.status === 200) {
                        return resp.json();
                    }

                    return Promise.reject(new Error(resp.status));
                }).
                then((data) => {
                    let id = this._data.id;
                    this._data = data;
                    this._data.is_logged_in = true;
                    this._data.id = id;

                    Emitter.emit(doneGetUser, this._data);
                }).
                catch((err) => {
                    Emitter.emit("error", err);
                });
        }
    }

    /**
     * @return {*}
     * Get user session and check if user logged in or check stored user data
     */
    async isLoggedIn({eventCheckUserLogin = "done-check-user-login"} = {}) {
        if (!this._data.id) {
            await AjaxModule.doGet({path: "/session"}).
                then((resp) => {
                    if (resp.status === 200) {
                        return resp.json();
                    }

                    return Promise.reject(new Error("no login"));
                }).
                then((data) => {
                    this._data = {id: data.ID, is_logged_in: true};
                    Emitter.emit(eventCheckUserLogin, true);
                }).
                catch(() => {
                    this._data = {id: 0, is_logged_in: false};
                    Emitter.emit(eventCheckUserLogin, false);
                });
        } else {
            Emitter.emit(eventCheckUserLogin, this._data.id !== 0);
        }
    }

    /**
     * @param {JSON} data Update fields
     * @return {Promise}
     * Send updated data to server
     */
    update(data, {updateSuccess = "update-success"} = {}) {
        return AjaxModule.doPut({path: `/user/${this._data.id}`, body: data}).
            then((resp) => {
                if (resp.status === 200) {
                    this._data = {};
                    Emitter.emit(updateSuccess, resp);
                    Emitter.emit("wipe-views");
                }

                Emitter.emit("update-error", resp.status);
            });
    }

    /**
     * @param {JSON} data User data
     * @return {Promise}
     * Send new user data to server
     */
    register(data) {
        return AjaxModule.doPost({path: "/user", body: data}).
            then((resp) => {
                if (resp.status === 409) {
                    Emitter.emit("server-validation-error", "User already exists");
                }
                if (resp.status === 400) {
                    Emitter.emit("server-validation-error", "User already login");
                }

                if (resp.status === 201) {
                    this._data = {};
                    // Emitter.emit("reg-success", data);
                    Emitter.emit("wipe-views");
                }

                if (resp.status === 500) {
                    Emitter.emit("server-validation-error", "Server error");
                }
            });
    }

    /**
     * @param {JSON} data User data
     * @return {Promise}
     * Try to login user
     */
    login(data) {
        return AjaxModule.doPost({path: "/session", body: data}).
            then((resp) => {
                if (resp.status === 400) {
                    Emitter.emit("server-validation-error", "No such user");
                }

                if (resp.status === 201) {
                    this._data = {};
                    Emitter.emit("wipe-views");
                }

                if (resp.status === 500) {
                    Emitter.emit("server-validation-error", "Server error");
                }
            });
    }

    /**
     * @return {Promise}
     * logout user
     */
    logout() {
        if (this._data.is_logged_in) {
            AjaxModule.doDelete({path: "/session"}).
                then((resp) => {
                    if (resp.status === 200) {
                        this._data = {};
                        Emitter.emit("wipe-views");
                    } else {
                        return Promise.reject(new Error(resp.status));
                    }
                }).
                catch((err) => {
                    Emitter.emit("error", err);
                });
        }
    }


    /** Validate form by server response
     * @param {Object} data about validation from server
     * @return {boolean} error field
     */
    static serverValidate(data) {
        if (data.ValidateSuccess) {
            return true;
        }

        Emitter.emit("server-validation-error", data);

        return false;
    }


}