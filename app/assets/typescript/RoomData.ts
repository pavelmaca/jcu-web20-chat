class RoomData {

    private _id: number;
    private _name: string;

    private _messages: Message[] = [];


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


    get messages(): Message[] {
        return this._messages;
    }

    public initMessages(messages: Message[]) {
        this.initialized = true;
        this.messages.concat(messages);
    }

    public addMessage(message: Message) {
        this.messages.push(message);
    }
}