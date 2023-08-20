
export interface IUserState {
    id:string,
    name:string,
    chacheId?:string,
    [key:string]:any
}

export interface IUserAction {
    type:string,
    [key:string]:any
}