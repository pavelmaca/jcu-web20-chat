/**
 * Created by Assassik on 02.01.2017.
 */
class Message{
    private _id:number;
    private _name:string;
    private _text:string;
    private _sentOn:Date;


    constructor(id: number, name: string, text: string, sentOn: Date) {
        this._id = id;
        this._name = name;
        this._text = text;
        this._sentOn = sentOn;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get text(): string {
        return this._text;
    }

    get sentOn(): Date {
        return this._sentOn;
    }
}