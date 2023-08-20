import {all} from "redux-saga/effects"
/**
 * 异步sage 
 */

// 相关api

/**
 *  takeEvery :表示每次都执行js函数生成器（一般使用这个）
    take: 表示只执行一次
    call：调用异步方法，并且让它同步执行
    fork: 调用异步方法，并且是异步执行
    select: 查询当前state的值
    put：类似dispatch方法
 */


import userSage from "./user/saga"
export default function*(){
    yield all([userSage()])
}