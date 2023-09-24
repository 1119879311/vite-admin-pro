import { useReducer } from 'react';
import {userReducer,initUserState} from "./modules/userInfo"


export const appState = {
    userState:initUserState
}

export const appReducer = (state=appState,acion:{type:string|symbol,pyload?:any})=>{

    state.userState=userReducer(state.userState,acion,state)
     return {...state};

}

export type IAppState = typeof appState

export const useAppReducer =(initState?:IAppState)=> useReducer(appReducer,initState? {...appState,...initState}:appState);

export type IAppReducer = ReturnType<typeof useAppReducer>

