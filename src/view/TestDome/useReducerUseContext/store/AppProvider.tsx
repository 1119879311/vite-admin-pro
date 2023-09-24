import { FC, PropsWithChildren, useCallback } from "react";
import { AppContext } from "./appContext";
import { IAppState, useAppReducer } from "./appReducer";

export const AppProvider:FC<PropsWithChildren<{
    initState?:IAppState
}>>= ({children,initState })=>{

   
    const [store,dispatch] = useAppReducer(initState);
  
    return <AppContext.Provider value={{store,dispatch}}>{children}</AppContext.Provider>
}