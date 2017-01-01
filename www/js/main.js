//TODO actualy hate JS after using TypeScript once... maybe rewite this bulshits ??

// array of rooms
// index: room
// values: message array
var roomList = [];
var activeRoom = null;
// TODO var username = null;

$(function () {
    $("#conversations").on('click', ".conversation", function (e) {
        var roomId = $(this).data("roomId");
        if (roomId !== activeRoom) {
            $('#conversations .conversation.active').removeClass('active');
            $(this).addClass('active');

            onRoomSelected(roomId, $(this));
        }
        console.log("room selected: " + roomId);
    });
    getUserName();
});

function showError(message) {
    console.log(message);
}


function getUserName() {
    if (typeof(Storage) !== "undefined") {
        var username = localStorage.getItem("username");
        if (username !== null) {
            console.log("username loaded from storage");
            return startApp(username);
        }
    }

    $('#usernameForm').on("submit", function () {
        var userInput = $("#usernameInput");
        var username = userInput.val();
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
        startApp(username);

        event.preventDefault();
    })

    // open username dialog
    $('#userNameModal').modal({
        backdrop: "static",
        keyboard: false,
    });
}

function startApp(username) {
    // load room list
    $.get("/api/rooms", null, function (data) {
        for (var i in data) {
            var room = data[i];
            addRoom(room);
        }
        $("#conversations .conversation:first").click();
    })
}

function addRoom(room) {
    roomList.push = {
        "id": room.id,
        "room": room,
        "messageList": [],
    };
    $("#conversations").append('<div class="conversation btn" data-room-id="' + room.id + '">' +
        '<div class="media-body">' +
        '<h5 class="media-heading">' + room.name + '</h5>' +
        //   '<small class="pull-right time">Last seen 12:10am</small>' +
        '</div>' +
        '</div>');
}

function getRoomHistory(roomId, since) {
    $.getAsy("/api/messages", {"roomId": roomId}, function (data) {
        console.log("room history recieved");
        for (var i in data) {
            messageRecived(data[i], roomId);
        }
    })
}

function messageRecived(message, roomId) {
    console.log("message received")
    console.log(message);
    console.log(roomId);
    console.log(roomList);
    for (var i in roomList) {
        var roomData = roomList[i];
        if (roomData.id == roomId) {
            roomData.messageList.push(message);
            if (activeRoom == roomData.id) {
                showNewMessage(message);
            }
            break;
        }
    }
}

function showNewMessage(message) {
    console.log("todo: show message " + message.message + " from: " + message.name);
}

function onRoomSelected(roomId, roomMenuItem) {
    activeRoom = roomId;
    getRoomHistory(roomId, null);
}