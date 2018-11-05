import AjaxModule from "../modules/Ajax.mjs";
import Emitter from "../modules/Emitter.js";
import {errorHandler} from "../misc.js";

export default class UserModel {
    static Fetch() {
        if (UserModel.__data !== null) {
            Emitter.emit("done-get-user", UserModel.__data);
            return;
        }

        console.log("server fetchiung user", UserModel.__data);

        AjaxModule.doGet({path: "/session"}).
            then((resp) => {
                if (resp.status === 200) {
                    return resp.json();
                }

                return Promise.reject(new Error("no login"));
            }).
            then((data) => {
                console.log(data);
                UserModel.__data = data;
                UserModel.__data.is_logged_in = true;
                Emitter.emit("done-get-user", UserModel.__data);
            }).
            catch((err) => {
                errorHandler(err);
                UserModel.__data = {is_logged_in: false};

                Emitter.emit("done-get-user", UserModel.__data);
            });
    }

    static IsLoggedIn() {
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
                    errorHandler(err);
                    UserModel.__data = {is_logged_in: false};

                    Emitter.emit("done-check-user-login", false);
                });
        } else {
            Emitter.emit("done-check-user-login", UserModel.__data.is_logged_in);
        }
    }

    static Update(data) {
        AjaxModule.doPut({path: `/user/${UserModel.__data.id}`, body: data}).
            then((resp) => {
                if (resp.status === 200) {
                    // Emitter.emit("update-success", resp);
                    Emitter.emit("wipe-views");
                    UserModel.__data = null;
                }

                // Emitter.emit("update-error", resp.status);
            });
    }

    static Register(data) {
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
            catch((data) => {
                data.then((body) => {
                    UserModel.serverValidate(body);
                });
            });
    }

    static Login(data) {
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
            catch((data) => {
                data.then((body) => {
                    UserModel.serverValidate(body);
                });
            });
    }

    static Logout() {
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
                    errorHandler(err);
                });
        }
    }


    /** Validate form by server response
     *
     * @param {Object} data about validation from server
     *
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