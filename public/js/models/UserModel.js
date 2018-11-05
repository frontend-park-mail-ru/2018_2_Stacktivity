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

        UserModel.__data = null;

        Emitter.on("get-user", this.fetch, false);
        Emitter.on("check-user-login", this.isLoggedIn, false);
        Emitter.on("submit-data-login", this.login, false);
        Emitter.on("submit-data-signup", this.register, false);
        Emitter.on("submit-data-profile", this.update, false);
        Emitter.on("user-logout", this.logout, false);

        UserModel.__instance = this;
    }

    /**
     * @return {*}
     * Get user data from server or return fetched data
     */
    fetch() {
        if (UserModel.__data !== null) {
            Emitter.emit("done-get-user", UserModel.__data);
            return;
        }

        AjaxModule.doGet({path: "/session"}).
            then((resp) => {
                if (resp.status === 200) {
                    return resp.json();
                }

                return Promise.reject(new Error("no login"));
            }).
            then((data) => {
                UserModel.__data = data;
                UserModel.__data.is_logged_in = true;
                Emitter.emit("done-get-user", UserModel.__data);
            }).
            catch((err) => {
                Emitter.emit("error", err);
                UserModel.__data = {is_logged_in: false};

                Emitter.emit("done-get-user", UserModel.__data);
            });
    }

    /**
     * @return {*}
     * Get user session and check if user logged in or check stored user data
     */
    isLoggedIn() {
        if (UserModel.__data === null) {
            AjaxModule.doGet({path: "/session"}).
                then((resp) => {
                    if (resp.status === 200) {
                        return resp.json();
                    }

                    return Promise.reject(new Error("no login"));
                }).
                then((data) => {
                    UserModel.__data = data;
                    UserModel.__data.is_logged_in = true;
                    Emitter.emit("done-check-user-login", true);
                }).
                catch((err) => {
                    Emitter.emit("error", err);
                    UserModel.__data = {is_logged_in: false};

                    Emitter.emit("done-check-user-login", false);
                });
        } else {
            Emitter.emit("done-check-user-login", UserModel.__data.is_logged_in);
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
                    UserModel.__data = null;
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
                if (resp.status === 400) {
                    return Promise.reject(resp.json());
                }

                if (resp.status === 200) {
                    UserModel.__data = null;
                    // Emitter.emit("reg-success", data);
                    Emitter.emit("wipe-views");
                }

                if (resp.status === 500) {
                    // Emitter.emit("reg-error", resp.status);
                }
            }).
            catch((jsonPromise) => {
                jsonPromise.then((body) => {
                    UserModel.serverValidate(body);
                });
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
                    return Promise.reject(resp.json());
                }

                if (resp.status === 200) {
                    UserModel.__data = null;
                    // Emitter.emit("login-success", data);
                    Emitter.emit("wipe-views");
                }

                if (resp.status === 500) {
                    Emitter.emit("login-error", resp.status);
                }
            }).
            catch((jsonPromise) => {
                jsonPromise.then((body) => {
                    UserModel.serverValidate(body);
                });
            });
    }

    /**
     * @return {Promise}
     * logout user
     */
    logout() {
        if (UserModel.__data !== null) {
            AjaxModule.doDelete({path: "/session"}).
                then((resp) => {
                    if (resp.status === 200) {
                        UserModel.__data = null;
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