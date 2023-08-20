import { userActions } from "./constant";


export const setUserAction = (data)=>({
    type:userActions.SET_USER_INFO_ACTION,
    ...data,
})


export const getUserAction = (data)=>({
    type:userActions.GET_USER_INFO_ACTION,
    ...data,
})
