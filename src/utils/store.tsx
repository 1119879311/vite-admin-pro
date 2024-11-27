import React, { PropsWithChildren, useContext, useState } from "react";

type IModelsType<T extends Record<string,any>>  = (...arg: any) => T;

const Provider = <T extends Record<string,any>,>(
  Compent: React.ComponentProps<any>,
  models: IModelsType<T>
): ((props: PropsWithChildren<any>) => JSX.Element) => {
  return (props: PropsWithChildren<any>) => {
    const modelValue = models();
    return <Compent value={modelValue} {...props} />;
  };
};


const createStore = <T extends Record<string,any>,>(models: IModelsType<T>,initValues:Partial<T>) =>{
  const StoreContext = React.createContext(initValues);
  const useModel = (modelName?: keyof T) => {
    const stores = useContext(StoreContext);
    return modelName?stores[modelName]:stores;
  };

  return {
    useModel,
    Provider: Provider<T>(StoreContext.Provider, models),
  };
};


export default createStore;
