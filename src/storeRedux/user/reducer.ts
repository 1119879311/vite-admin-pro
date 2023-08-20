
import {IUserState,IUserAction} from "./type"
import {userActions} from "./constant"
const inintSate ={

} as IUserState


export const userReducer =  (state=inintSate,action:IUserAction)=>{
    let {type,...data} = action
    switch (action.type) {
        case userActions.SET_USER_INFO_ACTION:
            return Object.assign({},state,data)
        // case userActions.GET_USER_INFO_ACTION:
        //     return Object.assign({},state,data)
        default:
          return state
    }
   
}