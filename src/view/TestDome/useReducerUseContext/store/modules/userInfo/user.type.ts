/**
 * 类型
 */
export interface IUser {
    [key:string] :any
}

export interface IUserAction {
    type:string|symbol,
    pyload?:any,
    [key:string]:any
}


// export interface IuseUserAction {
//     updateUserInfo:(data:any)=>void
// }

/**
 *  hooks
 */

export interface IUseUserStore {
    store:IUser,
    // action:IuseUserAction
    updateUserInfo:(data:any)=>void
}