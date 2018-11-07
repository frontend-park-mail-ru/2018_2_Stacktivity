/**
 * @module models/UserModel
 */

import AjaxModule from "../modules/Ajax.mjs";
import Emitter from "../modules/Emitter.js";

/**
 * User model
 * @class UserModel
 */
class UserModel {
    /**
     * @return {UserModel|*}
     * Creates the model
     */
    constructor() {
        if (UserModel.__instance) {
            return UserModel.__instance;
        }

        UserModel.__data = {};

        Emitter.on("get-user", this.fetch.bind(this), false);
        Emitter.on("check-user-login", this.isLoggedIn.bind(this), false);
        Emitter.on("submit-data-login", this.login.bind(this), false);
        Emitter.on("submit-data-signup", this.register.bind(this), false);
        Emitter.on("submit-data-profile", this.update.bind(this), false);
        Emitter.on("user-logout", this.logout.bind(this), false);

        UserModel.__instance = this;
    }

    /**
     * @return {*}
     * Get user data from server or return fetched data
     */
    fetch() {
        console.log(UserModel.__data);

        if (UserModel.__data.username !== undefined) {
            Emitter.emit("done-get-user", UserModel.__data);
            return;
        }

        if (UserModel.__data.id === undefined) {
            console.log(1);
            Emitter.on("done-check-user-login", this.fetch.bind(this));
            Emitter.emit("check-user-login");
            return;
        }

        if (!UserModel.__data.is_logged_in) {
            console.log(2);
            Emitter.emit("done-get-user", UserModel.__data);
        } else {
            console.log(3);
            AjaxModule.doGet({path: `/user/${UserModel.__data.id}`}).
                then((resp) => {
                    if (resp.status === 200) {
                        return resp.json();
                    }

                    return Promise.reject(new Error(resp.status));
                }).
                then((data) => {
                    let id = UserModel.__data.id;
                    UserModel.__data = data;
                    UserModel.__data.is_logged_in = true;
                    UserModel.__data.id = id;

                    Emitter.emit("done-get-user", UserModel.__data);
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
    isLoggedIn() {
        if (!UserModel.__data.id) {
            AjaxModule.doGet({path: "/session"}).
                then((resp) => {
                    if (resp.status === 200) {
                        return resp.json();
                    }

                    return Promise.reject(new Error("no login"));
                }).
                then((data) => {
                    // console.log(data)
                    UserModel.__data = {id: data.ID, is_logged_in: true};
                    Emitter.emit("done-check-user-login", true);
                }).
                catch((err) => {
                    UserModel.__data = {id: 0, is_logged_in: false};
                    Emitter.emit("done-check-user-login", false);
                });
        } else {
            Emitter.emit("done-check-user-login", UserModel.__data.id !== 0);
        }
    }

    /**
     * @param {JSON} data Update fields
     * @return {Promise}
     * Send updated data to server
     */
    update(data) {
        return AjaxModule.doPut({path: `/user/${UserModel.__data.id}`, body: data}).
            then((resp) => {
                if (resp.status === 200) {
                    // Emitter.emit("update-success", resp);
                    Emitter.emit("wipe-views");
                    UserModel.__data = {};
                }

                // Emitter.emit("update-error", resp.status);
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
                    UserModel.__data = {};
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
                    UserModel.__data = {};
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
        if (UserModel.__data.is_logged_in) {
            AjaxModule.doDelete({path: "/session"}).
                then((resp) => {
                    if (resp.status === 200) {
                        UserModel.__data = {};
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

export default new UserModel();