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
    return RoomData;
}());
//# sourceMappingURL=RoomData.js.map