import {AjaxModule, errorHandler} from "../modules/ajax.mjs";
import Emitter from "../modules/Emitter.js";
import {router} from "../modules/Router.mjs";

class UserModel {
    constructor() {
        UserModel.__data = null;
    }

    // static UpdateUser(new_data) {
    // }

    static Fetch() {
        if (UserModel.__data) {
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
                Emitter.emit("done-get-user", data);
            }).
            catch((err) => {
                errorHandler(err);
                Emitter.emit("done-get-user", {});
            });
    }

    static Logout() {
        if (UserModel.__data !== null) {
            AjaxModule.doDelete({path: "/session"}).
                then((resp) => {
                    if (resp.status === 200) {
                        Emitter.emit("done-user-logout");
                    } else {
                        return Promise.reject(new Error(resp.status));
                    }
                }).
                catch((err) => {
                    errorHandler(err);
                });
        }
    }
}


export default new UserModel();