import { useAppSelector, useAppDispatch } from "@/storeRedux";
import { setUserAction, getUserAction } from "@/storeRedux/user";
import { Button, Drawer, DrawerProps } from "antd";
import React, { FC, useContext, useState } from "react";
import { PropsWithChildren } from "react";

import CustomTabs, { ITabItemsProps } from "../Common/Tabs";

interface IAppProps {}

interface ITextConetxt {
  value: string;
  drawerProps?: DrawerProps;
  setValue: React.Dispatch<React.SetStateAction<string>> | undefined;
}

export const TestContext = React.createContext<ITextConetxt>({
  value: "原始值",
  setValue: undefined,
  drawerProps: { className: "custom-default" },
});

const CommonDrawer: FC<PropsWithChildren<DrawerProps>> = ({
  children,
  className: pclassName,
  ...props
}) => {
  const { drawerProps = { className: "" } } = useContext(TestContext);
  return (
    <Drawer
      {...drawerProps}
      {...props}
      className={`${drawerProps.className} ${pclassName}`}
    >
      {children}
    </Drawer>
  );
};

const Test: React.FC<IAppProps> = () => {
  const userInfo = useAppSelector((state) => state.userReducer);

  const result = useContext(TestContext);
  console.log("result", result);
  const dispatch = useAppDispatch();
  const onClick = () => {
    dispatch(setUserAction({ name: "userName", id: Math.random() }));
  };
  const onAsnyLoad = () => {
    dispatch(getUserAction({ chacheId: Math.random() }));
  };
  console.log("渲染啦。。。");
  return (
    <div>
      {userInfo.name} {userInfo.id}
      <div> {userInfo.chacheId} </div>
      <Button onClick={onClick}>设置用户信息</Button>
      <Button onClick={onAsnyLoad}>异步加载用户信息</Button>
      <hr></hr>
      组件1：{result.value}
    </div>
  );
};

const TestChild2: React.FC<IAppProps> = () => {
  const [open, setOpen] = useState(false);
  const result = useContext(TestContext);

  return (
    <div
      style={{
        height: 200,
        overflow: "hidden",
        position: "relative",
        border: "1px solid #ebedf0",
        borderRadius: 2,
        padding: 48,
        textAlign: "center",
      }}
    >
      <Button onClick={() => setOpen(true)}>弹窗</Button>
      <CommonDrawer
        className="custom-2"
        visible={open}
        title="自定义弹窗"
        onClose={() => setOpen(false)}
        getContainer={false}
        width={"100%"}
      >
        <div>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </div>
      </CommonDrawer>
      <Button onClick={() => result.setValue?.("context" + Math.random())}>
        自定义context
      </Button>
      组件2 ：{result.value}
    </div>
  );
};

const Test3: React.FC<IAppProps> = () => {
  const [open, setOpen] = useState(false);
  const result = useContext(TestContext);

  return (
    <div
      style={{
        height: 200,
        overflow: "hidden",
        position: "relative",
        border: "1px solid #ebedf0",
        borderRadius: 2,
        padding: 48,
        textAlign: "center",
      }}
    >
      <Button onClick={() => setOpen(true)}>弹窗</Button>
      <CommonDrawer
        className="custom-3"
        visible={open}
        title="自定义弹窗"
        onClose={() => setOpen(false)}
        getContainer={false}
        width={"100%"}
      >
        <div>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </div>
      </CommonDrawer>
      <Button onClick={() => result.setValue?.("context" + Math.random())}>
        自定义context
      </Button>
      组件3 ：{result.value}
    </div>
  );
};

const Test2 = () => {
  const [value, setValue] = useState("自定义");
  return (
    <div>
      <TestContext.Provider
        value={{
          value,
          setValue,
          drawerProps: {
            getContainer: false,
            className: "comon-custom-2",
            style: { position: "absolute" },
          },
        }}
      >
        <TestChild2></TestChild2>
      </TestContext.Provider>
    </div>
  );
};

const data: ITabItemsProps[] = [
  {
    tab: "示例",
    key: "1",
    children: <Test />,
  },
  {
    tab: "示例2",
    key: "2",
    children: <Test2 />,
  },
  {
    tab: "示例3",
    key: "3",
    children: <Test3></Test3>,
  },
];

const App = () => {
  return <CustomTabs data={data} />;
};

// const App = ()=>{
//     const [value,setValue] =  useState("自定义")
//     return <div>
//        <Test/>
//         <TestContext.Provider value={{value,setValue,drawerProps:{
//             getContainer:false,
//             className:"comon-custom-2",
//              style:{position: 'absolute'}
//         }}}><Test2></Test2></TestContext.Provider>

// <Test3></Test3>
//     </div>
// }
export default React.memo(App);
