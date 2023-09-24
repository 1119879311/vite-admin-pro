import { useAppSelector, useAppDispatch } from "@/storeRedux";
import { setUserAction, getUserAction } from "@/storeRedux/user";
import { Button } from "antd";
import React from "react";

interface IAppProps {}


const Child4 = React.memo(()=>{
    const dispatch = useAppDispatch();
  
    const onAsnyLoad = () => {
      dispatch(getUserAction({ chacheId: Math.random() }));
    };
    console.log("Child4渲染啦。。。");
    return (
      <div>
        <Button onClick={onAsnyLoad}>异步加载用户信息</Button>
        <hr></hr>
      </div>
    );
})



const Child3 = React.memo( ()=>{
    const dispatch = useAppDispatch();
    const onClick = () => {
      dispatch(setUserAction({ name: "userName", id: Math.random() }));
    };
   
    console.log("Child3渲染啦。。。");
    return (
      <div>
        <Button onClick={onClick}>设置用户信息</Button>
      
        <hr></hr>
      </div>
    );
})



const Child2 = React.memo( ()=>{
    console.log("子组件2渲染")
    return <div>
            <h4>子组件2</h4>
            <Child3/>
            <Child4/>
    </div>
})




const Child1 = React.memo( ()=>{
    const userInfo = useAppSelector((state) => state.userReducer);
    console.log("子组件1渲染")
    return <div>
            <h4>子组件1</h4>
            {userInfo.name}
            {userInfo.id}
            {userInfo.chacheId}
    </div>
})




const Test: React.FC<IAppProps> = () => {
  
  console.log("Test1渲染啦。。。");
  return (
    <div>
      <Child1/> 
                <Child2/> 
    </div>
  );
};






export default React.memo(Test);
