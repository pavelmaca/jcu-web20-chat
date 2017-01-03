import Moment = moment.Moment;
class App {
    private activeRoom: RoomData = null;
    private roomList: RoomData[] = [];

    private static historySize: number = 10;
    private static historyDaysBack: number = 2;

    public init() {
        this.initSwitchRoomListener();
        this.getUserName((username) => {
            this.loadRoomList();
        });
    }

    private initSwitchRoomListener() {
        $("#conversations").on('click', ".conversation", (e) => {
            let selectedRoomEl = $(e.currentTarget);
            let roomId = selectedRoomEl.data("roomId");
            console.log(selectedRoomEl);
            console.log(roomId);
            console.log(this.activeRoom);
            if (this.activeRoom == null || roomId != this.activeRoom.id) {
                console.log("hightlight");
                $('#conversations .conversation.active').removeClass('active');
                $(e.target).addClass('active');
                this.activeRoom = this.getRoomDataById(roomId);
                this.switchContext(this.activeRoom);
            }
            console.log("room selected: " + roomId);
        });
    }


    private getUserName(callback: (username: string) => void): void {
        if (typeof(Storage) !== "undefined") {
            let username = localStorage.getItem("username");
            if (username !== null) {
                console.log("username loaded from storage");
                callback(username);
                return;
            }
        }

        $('#usernameForm').on("submit", function () {
            let userInput = $("#usernameInput");
            let username = userInput.val();
            if (!username.replace(/^\s+/g, '').length) {
                userInput.parent("div").addClass("has-error");
            } else {
                userInput.parent("div").removeClass("has-error");
            }

            // Store username
            if (typeof(Storage) !== "undefined") {
                localStorage.setItem("username", username);
            }

            $('#userNameModal').modal('hide');
            callback(username);

            event.preventDefault();
        })

        // open username dialog
        $('#userNameModal').modal({
            backdrop: "static",
            keyboard: false,
        });


    }

    private loadRoomList() {
        $.get("/api/rooms", null, (data) => {
            for (let i in data) {
                let room = data[i];
                let roomData = new RoomData(room.id, room.name)
                this.roomList.push(roomData);
                this.showNewRoom(roomData)
            }
            $("#conversations .conversation:first").trigger("click");
        })
    }

    private showNewRoom(roomData) {
        $("#conversations").append('<div class="conversation btn" data-room-id="' + roomData.id + '">' +
            '<div class="media-body">' +
            '<h5 class="media-heading">' + roomData.name + '</h5>' +
            //   '<small class="pull-right time">Last seen 12:10am</small>' +
            '</div>' +
            '</div>');
    }

    private getRoomDataById(roomId) {
        //set active room
        for (let room of this.roomList) {
            if (room.id == roomId) {
                return room;
            }
        }
    }

    private switchContext(room: RoomData) {
        if (!room.isinitialized()) {
            return this.getMessages(room, App.historySize, moment().subtract(App.historyDaysBack, 'days'), (room: RoomData) => {
                this.switchContext(room)
            });
        }
        $(".messages .msg").remove();


        for (let message of room.getMessages()) {
            this.showNewMessage(message);
        }
    }

    private showNewMessage(message: Message) {
        $(".messages").append('<div class="msg">' +
            '<div class="media-body">' +
            '<small class="pull-right time"><i class="fa fa-clock-o"></i> '+message.sentOn.format('D.M. HH:mm:ss')+'</small>' +
            '<h5 class="media-heading">' + message.name + '</h5>' +
            '<small class="col-sm-11">' + message.text + '</small>' +
            '</div>' +
            '</div>');
    }

    private getMessages(room: RoomData, limit: Number, since: Moment, onSuccess: (room: RoomData) => any) {
        $.get("/api/messages", {"roomId": room.id, "since": since.utc().format()}, (data) => {
            console.log("room history recieved");
            for (let messageData of data) {
                let sentOn: Moment = moment(messageData.sentOn);
                let message: Message = new Message(messageData.id, messageData.name, messageData.message, sentOn);
                room.addMessage(message);
            }
            onSuccess(room);
        })
    }
}

try {
    $(function () {
        let application = new App();
        application.init();
    });
} catch (ex) {
    console.log(ex);
}