
import React from "react"
import { AppProvider } from "./store"
import { useUserStore } from "./store/modules/userInfo"
import { Button } from "antd"

const Child3 = React.memo( ()=>{
    const {updateUserInfo} = useUserStore()
    console.log("子组件3渲染")
    return <div>
            <h4>子组件3</h4>
            <Button onClick={()=>{
                updateUserInfo({name:`name-${Math.random()}`})
            }}>更新</Button>
           
    </div>
})

const Child2 = React.memo( ()=>{
    console.log("子组件2渲染")
    return <div>
            <h4>子组件2</h4>
            <Child3/>
    </div>
})




const Child1 = React.memo( ()=>{
    const {store} = useUserStore()
    console.log("子组件1渲染")
    return <div>
            <h4>子组件1</h4>
            {store.name}
    </div>
})


const Test1 = ()=>{
  
    return  <AppProvider initState={{userState:{name:"test2"}}}>
                <Child1/> 
                <Child2/> 
        </AppProvider>
}

export default Test1
