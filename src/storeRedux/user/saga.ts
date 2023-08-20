import {takeEvery,select,call,delay,put} from "redux-saga/effects"
import {useSageSelect} from "../index"
import { userActions } from "./constant"
import { IUserState } from "./type";
import { setUserAction } from "./action";

export default function*(){
  
    yield takeEvery(userActions.GET_USER_INFO_ACTION,function*(e){
        console.log("e",e);
        yield delay(2000)
        const userInfo:IUserState = yield useSageSelect(state=>state.userReducer) 
        // const info =yield select(state=>state.userReducer)
        console.log("userInfo",userInfo.chacheId)
       yield put(setUserAction({name:"sageName",id:Math.random()}))

        
    })
}
