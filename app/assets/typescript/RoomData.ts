class RoomData {

    private _id: number;
    private _name: string;

    private _messages: {[id: number]: Message} = {};

    private initialized = false;

    constructor(id: number, name: string) {
        this._id = id;
        this._name = name;
    }

    public isinitialized(): boolean {
        return this.initialized;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }


    public getMessages() {
        return Object.keys(this._messages).map(prop => this._messages[prop]).sort((a, b) => {
            return a.sentOn.diff(b.sentOn);
        })
    }

    public addMessage(message: Message):void {
        if (this.initialized == false) {
            this.initialized = true;
        }
        this._messages[message.id] = message;
    }

    public getLastMessageTime(): Moment {
        let messages: Message[] = this.getMessages();
        return messages[messages.length - 1].sentOn;
    }
}