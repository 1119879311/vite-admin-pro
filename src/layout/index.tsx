
import { Suspense, useEffect, useState } from "react"
import PageLayout from "../components/Layout"
import { Navigate, Outlet } from "react-router-dom"
import {observer} from "mobx-react"
import {menuData} from "./mock"

const BasicLayout = ()=>{

  
    const [leftMenu,setLeftMenu] = useState<any[]>(menuData);
    const [loading,setLoading] = useState(false)
    // useEffect(()=>{
    //     console.log("初始化")
    //     setTimeout(()=>{
    //         setLoading(false)
    //         setLeftMenu(menuData)
    //     },3000)
    // },[])
    return  <PageLayout leftMenu={leftMenu} loading={loading}><Outlet /></PageLayout>
}

export default observer(BasicLayout)