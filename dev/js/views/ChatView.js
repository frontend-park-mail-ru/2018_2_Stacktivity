import NavigationController from "../controllers/NavigationController.mjs";
import BaseView from "./BaseView.js";
import Emitter from "../modules/Emitter.js";
import WebSocks from "../modules/WS";
import {chatPath} from "../config";

/**
 * @extends BaseView
 */
export default class ChatView extends BaseView {
    /**
     * Creates view and registres view events
     */
    constructor() {
        super();
        // this._navigationController = new NavigationController();
        this._ws = new WebSocks("chat");
        this._ws.connect(chatPath);

        this.render();
        this.registerEvents();

        this._chat = document.getElementsByClassName("chat")[0];
        this._roomsDOM = this._chat.getElementsByClassName("chatcontent__messages")[0];
        this._talksDOM = this._chat.getElementsByClassName("talkboard__rooms")[0];
        this._userboardDOM = this._chat.getElementsByClassName("userboard")[0];

        this._rooms = [];
        this._currentRoom = 1; // главный канал

        /*
        * post: id, cid, username, message
        * */

        /*
        * слайс чатов
        * [
        *   {
        *       id,
        *       name,
        *       members: [],
        *       history [ post, post ]
        *   },
        *
        * ]
        * */

        Emitter.on("chat-message", (resp) => {
            if (resp.event === 4) {
                let chats = resp.data;
                console.log("init chat", chats);
                messages.forEach((chat) => {
                    if (!this._rooms[chat.id]) {
                        // создаём элемент под новую комнату
                        let new_room = document.createElement("section");
                        new_room.hidden = true;
                        this._rooms[chat.id] = new_room;
                        this._roomsDOM.appendChild(new_room);

                        // создаём элемент новой команты
                        this._talksDOM.innerHTML += Handlebars.templates.RoomEntry({
                            is_private: false,
                            name: chat.name,
                            cid: chat.id,
                        })

                        // todo members

                    }

                    // TODO стиллизация сообещний
                    chat.history.forEach((post) => {
                        // прикрепляем новый пост
                        let new_post = document.createElement("div");
                        new_post.innerText = `${post.id} : ${post.username} : ${post.message}`;
                        this._rooms[chat.id].appendChild(new_post)

                        // todo инкремент счетчика
                    });
                })
            } else if (resp.event === 5) {
                let message = resp.data;

                let new_post = document.createElement("div");
                new_post.innerText = `${message.id} : ${message.username} : ${message.message}`;
                this._rooms[message.cid].appendChild(new_post)

                // todo инкремент счетчика
            }
        });

        Emitter.on("change-room", (cid) => {
            console.log("change-room", cid);
            this._rooms[this._currentRoom].hidden = true;
            this._rooms[cid].hidden = false;
            this._currentRoom = cid;

            //todo swap members
        });

        Emitter.on("pick-user", (username) => {
            console.log("user picked");
            let form = this._chat.getElementsByClassName("form_chat"); // TODO change class name
            let input = form.getElementsByTagName("input")[0];
            input.value += username;
        })
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

        this.viewSection.innerHTML += `
    <div class="chat">
    	<div class="chat__talkboard talkboard">
    	    <a class="talkboard__toggle" data-toggle="show">
    	        Show rooms
            </a>
    	
    	    <div class="talkboard__rooms">
            <form class="chat__form">
               <input type="text" name="message" placeholder="add room" />
               <button type="submit">add</button>
            </form>
            
                <a class="talkboard__room room room_public">
                    <div class="room__icon">
                        #
                    </div>
                    
                    <div class="room__name">
                        Flood
                    </div>
                    
                    <div class="room__message-counter">
                        2
                    </div>
                </a>
                
                <a class="talkboard__room room room_private room_active">
                    <div class="room__icon">
                        &
                    </div>
                    
                    <div class="room__name">
                        @Silvman, @FirFir
                    </div>
                    
                    
                    <div class="room__message-counter">
                        10
                    </div>
                </a>
                
                <a class="talkboard__room room room_private">
                    <div class="room__icon">
                        &
                    </div>
                    
                    <div class="room__name">
                        @Fir
                    </div>
                </a>
            </div>
           
        </div>
       
        <div class="chat__chatcontent chatcontent chat__conversation conversation">
            <div class="chatcontent__messages">
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
            </div>
        
            <form class="chat__form">
               <input type="text" name="message" />
               <button type="submit">send</button>
            </form>
        </div>
        
        <div class="chat__userboard">
            <form class="chat__form">
               <input type="text" name="message" placeholder="add user" />
               <button type="submit">add</button>
            </form>
            
            <a class="userboard__user">
                <div class="user__status user__status_online"></div>
                @Silvman
            </a>
        </div>
    </div>
`

    }

    /**
     * Register events for NavigationController and LeaderboardController to handle
     * @return {undefined}
     */
    registerEvents() {
        this.viewSection.addEventListener("click", (event) => {
            let link = NavigationController._getEventTarget(event.target);
            if (!link) {
                return;
            }
            event.preventDefault();

            console.log("click!");

            if (link.dataset.cid) {
                Emitter.emit("change-room", cid);
                return;
            }

            if (link.dataset.username) {
                Emitter.emit("pick-user", event.dataset.username)
            }

            if (link.dataset.toggle === "show") {
                link.innerText = "Hide rooms";
                this._talksDOM.style.display = 'grid';
                link.dataset.toggle = "hide";

                document.getElementsByClassName("chat__talkboard")[0].style.maxHeight = "30vh";

            } else if (link.dataset.toggle === "hide") {
                link.innerText = "Show rooms";
                this._talksDOM.style.display = 'none';
                link.dataset.toggle = "show";
                document.getElementsByClassName("chat__talkboard")[0].style.maxHeight = "10vh";
            }

        });

        document.getElementsByClassName("chatcontent")[0].addEventListener("submit", (event) => {
            // todo создание, включение пользователей в комнаты
            event.preventDefault();

            console.log("form sent!");

            let data = {
                event: 1,
                data: {
                    cid: this._currentRoom,
                    message: event.target.elements.message,
                    // attach : event.target.elements.attach
                }
            };

            Emitter.emit("chat-send", data);
        });

        document.getElementsByClassName("chat__userboard")[0].addEventListener("submit", (event) => {
            // todo создание, включение пользователей в комнаты
            event.preventDefault();

            console.log("form add user sent!");

            let data = {
                event: 3,
                data: {
                    cid: this._currentRoom,
                    username: event.target.elements.username,
                }
            };

            Emitter.emit("chat-send", data);
        });

        document.getElementsByClassName("chat__talkboard")[0].addEventListener("submit", (event) => {
            // todo создание, включение пользователей в комнаты
            event.preventDefault();

            console.log("form add room sent!");

            let data = {
                event: 2,
                data: {
                    cid: this._currentRoom,
                    name: event.target.elements.name,
                }
            };

            Emitter.emit("chat-send", data);
        });


    }
}