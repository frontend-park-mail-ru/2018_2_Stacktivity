import BaseController from "./BaseController.js";
import Emitter from "../modules/Emitter.js";

class LogoutController extends BaseController {
    operate() {
        Emitter.emit("user-logout");
    }
}