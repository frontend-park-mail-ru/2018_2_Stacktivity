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
    <div class="chat">
    	<div class="chat__talkboard">
        </div>
       
        <div class="chat__conversation conversation">
            <div class="conversation__messages messages">
            
                <div class="messages__messagesunion messagesunion">
                    
                    <div class="messagesunion__messageblock messageblock">
                        
                        <div class="messageblock__author author">
                            <div class="autor__unionauthordata unionauthordata">
                                <div class="unionauthordata__nickname">
                                        nickname
                                </div>        
                                <div class="unionauthordata__circle">
                                </div>
                            </div>
                        </div>  
                            
                        <div class="messageblock__messagedata messagedata">
                            <div class="messagedata__dataunion dataunion">
                                <div class="dataunion__messagetext">
Указывает, что элемент абсолютно позиционирован, при этом другие элементы отображаются на веб-странице словно абсолютно позиционированного элемента и нет. Положение элемента задается свойствами left, top, right и bottom, также на положение влияет значение свойства position родительского элемента. Так, если у родителя значение position установлено как static или родителя нет, то отсчет координат ведется от края окна браузера. Если у родителя значение position задано как fixed, relative или absolute, то отсчет координат ведется от края родительского элемента.
                                </div>
                                <hr>
                                <div class="dataunion__messagedate">
                                    21.21.2112 12:12
                                </div>
                            </div>    
                        </div>  
                    </div>
                    
                    <div class="messagesunion__messageblock messageblock">
                        
                        <div class="messageblock__author author">
                            <div class="autor__unionauthordata unionauthordata">
                                <div class="unionauthordata__nickname">
                                        nickname
                                </div>        
                                <div class="unionauthordata__circle">
                                </div>
                            </div>
                        </div>  
                            
                        <div class="messageblock__messagedata messagedata">
                            <div class="messagedata__dataunion dataunion">
                                <div class="dataunion__messagetext">
Указывает, что элемент абсолютно позиционирован, при этом другие элементы отображаются на веб-странице словно абсолютно позиционированного элемента и нет. Положение элемента задается свойствами left, top, right и bottom, также на положение влияет значение свойства position родительского элемента. Так, если у родителя значение position установлено как static или родителя нет, то отсчет координат ведется от края окна браузера. Если у родителя значение position задано как fixed, relative или absolute, то отсчет координат ведется от края родительского элемента.
                                </div>
                                <hr>
                                <div class="dataunion__messagedate">
                                    21.21.2112 12:12
                                </div>
                            </div>    
                        </div>  
                    </div>
                    
                    <div class="messagesunion__messageblock messageblock">
                        
                        <div class="messageblock__author author">
                            <div class="autor__unionauthordata unionauthordata">
                                <div class="unionauthordata__nickname">
                                        nickname
                                </div>        
                                <div class="unionauthordata__circle">
                                </div>
                            </div>
                        </div>
                            
                        <div class="messageblock__messagedata messagedata">
                            <div class="messagedata__dataunion dataunion">
                                <div class="dataunion__messagetext">
Указывает,
                                </div>
                                <hr>
                                <div class="dataunion__messagedate">
                                    21.21.2112 12:12
                                </div>
                            </div>    
                        </div>  
                    </div>
                    
                </div>
            </div>
            <div class="conversation__messageinput messageinput">
            </div>
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