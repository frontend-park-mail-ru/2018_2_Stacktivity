/**
 */

import NavigationController from "../controllers/NavigationController.mjs";
import LeaderboardController from "../controllers/LeaderboardController.mjs";
import BaseView from "./BaseView.js";
import Emitter from "../modules/Emitter.js";
import LeaderboardModel from "../models/LeaderboardModel.js";

/**
 * @extends BaseView
 */
export default class ChatView extends BaseView {
    /**
     * Creates view and registres view events
     */
    constructor() {
        super();
        this._navigationController = new NavigationController();
        this.render();
        this.registerEvents();
    }

    /**
     * Emits load event and shows view
     * @return {undefined}
     */
    show() {
        super.show();
    }

    /**
     * Resets page number to 1
     * @return {undefined}
     */
    hide() {
        super.hide();
    }

    /**
     * Render this view
     * @return {undefined}
     */
    render() {
        super.render();

        this.viewSection.innerHTML += Handlebars.templates.Header({desc: "Chat"});
        this.viewSection.innerHTML += Handlebars.templates.Nav({
            links: [
                {
                    content: "<-",
                    class: [
                        "circle_size_tiny",
                        "circle_color_grey",
                        "navigation__circle_position_return",
                    ],
                    href: "/",
                }
            ]
        });

        this.viewSection.innerHTML += `
         
    <style>
       .chat {
        width: 800px;
           height:400px;
           background: #ddd;
           
        	display: grid;
           
        }
    </style>
    
    <div class="chat">
    	<div class="chat__talkboard">
        
        </div>
       
        <div class="chat__content">
        
        </div>
        
        <div class="chat__userboard">
        
        </div>
    </div>
`

    }

    /**
     * Register events for NavigationController and LeaderboardController to handle
     * @return {undefined}
     */
    registerEvents() {
        this.viewSection.addEventListener("click", this._navigationController.keyPressedCallback.bind(this._navigationController));
    }
}