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
//# sourceMappingURL=Message.js.map