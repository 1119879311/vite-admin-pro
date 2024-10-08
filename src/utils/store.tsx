import React, { PropsWithChildren, useContext, useState } from "react";

const Provider = <T extends Function>(
  Compent: React.ComponentProps<any>,
  models: T
): ((props: PropsWithChildren<any>) => JSX.Element) => {
  return (props: PropsWithChildren<any>) => {
    const modelValue = models();
    return <Compent value={modelValue} {...props} />;
  };
};
const createStore = <
  T extends (...args: any) => Record<string, any>,
  K extends ReturnType<T>
>(
  models: T,
  initValues: K
) => {
  const StoreContext = React.createContext(initValues);
  const useModel = (modelName: keyof K) => {
    const stores = useContext(StoreContext);
    return stores[modelName];
  };

  return {
    useModel,
    Provider: Provider<T>(StoreContext.Provider, models),
  };
};

// const defaultModel = {

// }

export default createStore;
