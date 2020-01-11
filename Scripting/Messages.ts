import ez = require("TypeScript/ez")

export class MsgAddHealth extends ez.Message {

    EZ_DECLARE_MESSAGE_TYPE;

    addHealth: number = 0;
    return_consumed: boolean = true;
}