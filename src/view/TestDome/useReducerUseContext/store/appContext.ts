import React,{useContext} from "react";
import { IAppReducer, appState } from "./appReducer";

export interface IAppContext {
    store:IAppReducer[0]
    dispatch:IAppReducer[1],
    [key:string]:any
}

export const AppContext=React.createContext<IAppContext>({store:appState,dispatch:()=>{}})

export const useAppContext = ()=>useContext(AppContext)