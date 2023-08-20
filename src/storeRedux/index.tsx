import { createStore ,applyMiddleware} from 'redux';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import createSageMiddlewares from "redux-saga"

import {select} from "redux-saga/effects"


import rootReducer from './reducer';
import allSage from "./sage"
/**
 * 创建store
 */


/**
 * 创建sage 中间件
 */
const sageMiddlewares = createSageMiddlewares();

/**
 * 创建 redux 实例
 * 三个参数
 * @param1 reducers：  reducer
 * @param2 initState： 初始化state 值1
 * @param3 中间件
 */
const store = createStore(rootReducer,{},applyMiddleware(sageMiddlewares))

sageMiddlewares.run(allSage)


// store.getState
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// 在整个应用程序中使用，而不是简单的 `useDispatch` 和 `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useSageSelect: TypedUseSelectorHook<RootState> = select;

export default store


