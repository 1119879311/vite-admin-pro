import { useCallback } from "react"
import { useAppContext } from "../../appContext"
import { IUseUserStore, IUser, IUserAction } from "./user.type"



/**
 * 常量
 */
const userConstant = {
    UPDATE_USER_INFO:Symbol('UPDATE_USER_INFO')
}




// 初始值
export const initUserState:IUser= {

}


/**
 * Reducer
 * @param state 
 * @param action 
 * @param rootState 
 * @returns 
 */
export const userReducer = (state=initUserState,action:IUserAction,rootState?:any)=>{
    const {type,pyload} = action;
    
    switch (type) {
        case userConstant.UPDATE_USER_INFO:
         
         return {...state,...pyload||{}}
    
        default:
            return state
    }


}



export const userActions = {
    update:(data:any)=>({  type:userConstant.UPDATE_USER_INFO,
        pyload:data })
}




export const useUserAction = ()=>{

    const {dispatch} = useAppContext();
    const updateUserInfo = useCallback((data:IUser)=>{
        dispatch({
            type:userConstant.UPDATE_USER_INFO,
            pyload:data
        })
    },[])
    return {
        updateUserInfo
    }
}


export function useUserStore():IUseUserStore{
    const {store,dispatch} = useAppContext()
    const updateUserInfo = useCallback((data:IUser)=>{
        dispatch({
            type:userConstant.UPDATE_USER_INFO,
            pyload:data
        })
    },[])
    return {
        store:store.userState,
        updateUserInfo
    }
}




