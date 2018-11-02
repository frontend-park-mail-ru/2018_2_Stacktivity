import BaseController from "./BaseController.js";
import Emitter from "../modules/Emitter.js";

export default class PageController extends BaseController {
    constructor(View = null) {
        super(View);
    }

    operate() {
        super.operate();
        Emitter.emit("get-user");
    }
}