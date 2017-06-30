export interface IFileObject {
    filename: string,
    shortname: string,
    size: number,
    birthtime: number
}

export interface Payload {
    id: number;
    parentId?: any;
    code: string;
    name: string;
    endpoints: string[];
    roles: number[];
    actionMask?: any;
}

export interface Error {
    errorCode?: any;
    errorMessage?: any;
}

export interface RootObject {
    success: boolean;
    payload: Payload[];
    error: Error;
}