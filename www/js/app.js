var App = (function () {
    function App() {
        this.activeRoom = null;
        this.roomList = [];
        this.refreshinterval = 500;
    }
    App.prototype.init = function () {
        var _this = this;
        this.initSwitchRoomListener();
        this.initSendMessageListener();
        this.getUserName(function (username) {
            _this.loadRoomList();
        });
    };
    App.prototype.initSwitchRoomListener = function () {
        var _this = this;
        $("#conversations").on('click', ".conversation", function (e) {
            var selectedRoomEl = $(e.currentTarget);
            var roomId = selectedRoomEl.data("roomId");
            if (_this.activeRoom == null || roomId != _this.activeRoom.id) {
                console.log("hightlight");
                $('#conversations .conversation.active').removeClass('active');
                $(e.currentTarget).addClass('active');
                _this.activeRoom = _this.getRoomDataById(roomId);
                _this.realoadContent(_this.activeRoom);
            }
            console.log("room selected: " + roomId);
        });
    };
    App.prototype.initSendMessageListener = function () {
        var _this = this;
        $("#messageForm").on('submit', function (e) {
            var text = $("#messageInput").val();
            if (text.length !== 0 && text.trim()) {
                _this.sendMessage(text, _this.activeRoom);
            }
            e.preventDefault();
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
                var roomObj = data[i];
                var room = new RoomData(roomObj.id, roomObj.name);
                _this.roomList.push(room);
                _this.showNewRoom(room);
                _this.getMessages(room, App.historySize, moment().subtract(App.historyDaysBack, 'days'), function (room) {
                    if (_this.activeRoom == room) {
                        _this.realoadContent(room);
                    }
                });
            }
            $("#conversations .conversation:first").trigger("click");
            _this.initRefreshTimer();
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
    App.prototype.realoadContent = function (room) {
        $(".messages .msg").remove();
        for (var _i = 0, _a = room.getMessages(); _i < _a.length; _i++) {
            var message = _a[_i];
            this.showNewMessage(message);
        }
    };
    App.prototype.showNewMessage = function (message) {
        $(".messages").append('<div class="msg">' +
            '<div class="media-body">' +
            '<small class="pull-right time"><i class="fa fa-clock-o"></i> ' + message.sentOn.format('D.M. HH:mm:ss') + '</small>' +
            '<h5 class="media-heading">' + message.name + '</h5>' +
            '<small class="col-sm-11">' + message.text + '</small>' +
            '</div>' +
            '</div>');
    };
    App.prototype.getMessages = function (room, limit, since, onSuccess) {
        $.get("/api/messages", {
            "roomId": room.id,
            "limit": limit,
            "sentSince": since.utc().format()
        }, function (data, textStatus, request) {
            console.log("room history recieved");
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var messageData = data_1[_i];
                var sentOn = moment(messageData.sentOn);
                var message = new Message(messageData.id, messageData.name, messageData.message, sentOn);
                room.addMessage(message);
            }
            onSuccess(room);
        });
    };
    App.prototype.sendMessage = function (text, room) {
        var _this = this;
        this.getUserName(function (username) {
            var sendTime = moment();
            $.post("/api/messages", {
                "name": username,
                "message": text,
                "roomId": room.id
            }, function (data, textStatus, request) {
                if (request.status == 201) {
                    var id = Number(request.getResponseHeader('Location').match(/.+\/([0-9]+)$/i)[1]);
                    var message = new Message(id, username, text, sendTime);
                    room.addMessage(message);
                    if (_this.activeRoom == room) {
                        _this.showNewMessage(message);
                        $("#messageInput").val("");
                    }
                }
            });
        });
    };
    App.prototype.initRefreshTimer = function () {
        var _this = this;
        this.timer = setInterval(function () { return _this.refreshMessages(); }, this.refreshinterval);
    };
    App.prototype.refreshMessages = function () {
        var _this = this;
        this.getMessages(this.activeRoom, null, this.activeRoom.getLastMessageTime(), function (room) {
            if (_this.activeRoom == room) {
                _this.realoadContent(room);
            }
        });
    };
    return App;
}());
App.historySize = 10;
App.historyDaysBack = 2;
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
        this._messages = {};
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
    RoomData.prototype.getMessages = function () {
        var _this = this;
        return Object.keys(this._messages).map(function (prop) { return _this._messages[prop]; }).sort(function (a, b) {
            return a.sentOn.diff(b.sentOn);
        });
    };
    RoomData.prototype.addMessage = function (message) {
        if (this.initialized == false) {
            this.initialized = true;
        }
        this._messages[message.id] = message;
    };
    RoomData.prototype.getLastMessageTime = function () {
        var messages = this.getMessages();
        return messages[messages.length - 1].sentOn;
    };
    return RoomData;
}());
