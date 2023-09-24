
import React from "react"
import { AppProvider, useAppContext } from "./store"
import { useUserAction, useUserStore, userActions } from "./store/modules/userInfo"
import { Button } from "antd"


const dataSet = new Set();

const Child5 = React.memo(()=>{
   
    const {updateUserInfo} = useUserStore()
    console.log("子组件5渲染")
    return <div>
            <h4>子组件5</h4>
            <Button onClick={()=>{
                // dispatch(userActions.update( {name:`name-Child4-${Math.random()}`}))
                updateUserInfo({name:`name-Child5-${Math.random()}`})
            }}>更新</Button>
           
    </div>
})

const Child4 = React.memo(()=>{
    // const {dispatch} = useAppContext()
    const {updateUserInfo} = useUserAction()
    console.log("子组件4渲染")
    return <div>
            <h4>子组件4</h4>
            <Button onClick={()=>{
                // dispatch(userActions.update( {name:`name-Child4-${Math.random()}`}))
                updateUserInfo({name:`name-Child4-${Math.random()}`})
            }}>更新</Button>
           
    </div>
})

const Child3 = React.memo( ()=>{
    // const {updateUserInfo} = useUserStore()
   

    const {dispatch} = useAppContext()
    console.log("子组件3渲染")
    return <div>
            <h4>子组件3</h4>
            <Button onClick={()=>{
                // updateUserInfo({name:`name-${Math.random()}`})
                dispatch(userActions.update( {name:`name-Child3-${Math.random()}`}))
            }}>更新</Button>
           
    </div>
})

const Child2 = React.memo( ()=>{
    console.log("子组件2渲染")
    return <div>
            <h4>子组件2</h4>
            <Child3/>
            <Child4/>
            <Child5/>
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
  
    return  <AppProvider initState={{userState:{name:"test1"}}}>
                <Child1/> 
                <Child2/> 
        </AppProvider>
}

export default Test1
