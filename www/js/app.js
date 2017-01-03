var App = (function () {
    function App() {
        this.activeRoom = null;
        this.roomList = [];
    }
    App.prototype.init = function () {
        var _this = this;
        this.initSwitchRoomListener();
        this.getUserName(function (username) {
            _this.loadRoomList();
        });
    };
    App.prototype.initSwitchRoomListener = function () {
        var _this = this;
        $("#conversations").on('click', ".conversation", function (e) {
            var selectedRoomEl = $(e.currentTarget);
            var roomId = selectedRoomEl.data("roomId");
            console.log(selectedRoomEl);
            console.log(roomId);
            console.log(_this.activeRoom);
            if (_this.activeRoom == null || roomId != _this.activeRoom.id) {
                console.log("hightlight");
                $('#conversations .conversation.active').removeClass('active');
                $(e.target).addClass('active');
                _this.activeRoom = _this.getRoomDataById(roomId);
                _this.switchContext(_this.activeRoom);
            }
            console.log("room selected: " + roomId);
        });
    };
    App.prototype.getUserName = function (callback) {
        if (typeof (Storage) !== "undefined") {
            var username = localStorage.getItem("username");
            if (username !== null) {
                console.log("username loaded from storage");
                callback(username);
                return;
            }
        }
        $('#usernameForm').on("submit", function () {
            var userInput = $("#usernameInput");
            var username = userInput.val();
            if (!username.replace(/^\s+/g, '').length) {
                userInput.parent("div").addClass("has-error");
            }
            else {
                userInput.parent("div").removeClass("has-error");
            }
            // Store username
            if (typeof (Storage) !== "undefined") {
                localStorage.setItem("username", username);
            }
            $('#userNameModal').modal('hide');
            callback(username);
            event.preventDefault();
        });
        // open username dialog
        $('#userNameModal').modal({
            backdrop: "static",
            keyboard: false,
        });
    };
    App.prototype.loadRoomList = function () {
        var _this = this;
        $.get("/api/rooms", null, function (data) {
            for (var i in data) {
                var room = data[i];
                var roomData = new RoomData(room.id, room.name);
                _this.roomList.push(roomData);
                _this.showNewRoom(roomData);
            }
            $("#conversations .conversation:first").trigger("click");
        });
    };
    App.prototype.showNewRoom = function (roomData) {
        $("#conversations").append('<div class="conversation btn" data-room-id="' + roomData.id + '">' +
            '<div class="media-body">' +
            '<h5 class="media-heading">' + roomData.name + '</h5>' +
            //   '<small class="pull-right time">Last seen 12:10am</small>' +
            '</div>' +
            '</div>');
    };
    App.prototype.getRoomDataById = function (roomId) {
        //set active room
        for (var _i = 0, _a = this.roomList; _i < _a.length; _i++) {
            var room = _a[_i];
            if (room.id == roomId) {
                return room;
            }
        }
    };
    App.prototype.switchContext = function (room, messages) {
        var _this = this;
        if (!room.isinitialized()) {
            return this.getMessages(room, null, function (room, messages) {
                _this.switchContext(room, messages);
            });
        }
        $(".messages .msg").remove();
        console.log(messages);
        var newMessages = (messages ? messages : room.messages);
        console.log(this);
        for (var _i = 0, newMessages_1 = newMessages; _i < newMessages_1.length; _i++) {
            var message = newMessages_1[_i];
            this.showNewMessage(message);
        }
    };
    App.prototype.showNewMessage = function (message) {
        $(".messages").append('<div class="msg">' +
            '<div class="media-body">' +
            '<small class="pull-right time"><i class="fa fa-clock-o"></i> 12:10am</small>' +
            '<h5 class="media-heading">' + message.name + '</h5>' +
            '<small class="col-sm-11">' + message.text + '</small>' +
            '</div>' +
            '</div>');
    };
    App.prototype.getMessages = function (room, since, onSuccess) {
        $.get("/api/messages", { "roomId": room.id }, function (data) {
            console.log("room history recieved");
            var messages = [];
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var messageData = data_1[_i];
                var message = new Message(messageData.id, messageData.name, messageData.message, messageData.sentOn);
                messages.push(message);
                room.messages.push(message);
            }
            if (!room.isinitialized()) {
                room.initMessages(messages);
            }
            onSuccess(room, messages);
        });
    };
    return App;
}());
try {
    $(function () {
        var application = new App();
        application.init();
    });
}
catch (ex) {
    console.log(ex);
}
/**
 * Created by Assassik on 02.01.2017.
 */
var Message = (function () {
    function Message(id, name, text, sentOn) {
        this._id = id;
        this._name = name;
        this._text = text;
        this._sentOn = sentOn;
    }
    Object.defineProperty(Message.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "text", {
        get: function () {
            return this._text;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "sentOn", {
        get: function () {
            return this._sentOn;
        },
        enumerable: true,
        configurable: true
    });
    return Message;
}());
var RoomData = (function () {
    function RoomData(id, name) {
        this._messages = [];
        this.initialized = false;
        this._id = id;
        this._name = name;
    }
    RoomData.prototype.isinitialized = function () {
        return this.initialized;
    };
    Object.defineProperty(RoomData.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoomData.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RoomData.prototype, "messages", {
        get: function () {
            return this._messages;
        },
        enumerable: true,
        configurable: true
    });
    RoomData.prototype.initMessages = function (messages) {
        this.initialized = true;
        this.messages.concat(messages);
    };
    RoomData.prototype.addMessage = function (message) {
        this.messages.push(message);
    };
    return RoomData;
}());
