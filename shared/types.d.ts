export declare type WsSubMessageEvent = {
    type: "SUB_MESSAGE";
    payload: {
        id: string;
        subject: string;
        data: unknown;
    };
};
export declare type WsEvent = WsSubMessageEvent;
export declare type NatsSub = {
    subject: string;
    dateCreated: string;
};
