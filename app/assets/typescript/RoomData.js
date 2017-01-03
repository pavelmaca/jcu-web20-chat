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
//# sourceMappingURL=RoomData.js.map