
import { Button, Drawer, DrawerProps } from "antd";
import React, { FC, useContext, useState } from "react";
import { PropsWithChildren } from "react";


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


export default React.memo(Test3);
