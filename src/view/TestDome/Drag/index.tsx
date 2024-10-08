import React from "react";
import CustomTabs, { ITabItemsProps } from "../Common/Tabs";
import Test1 from "./Test/Test1";
import Test2 from "./Test/Test2";
import Test3 from "./Test/Test3";

const data: ITabItemsProps[] = [
  {
    tab: "示例",
    key: "1",
    children: <Test2 />,
  },
  {
    tab: "示例2",
    key: "2",
    children: <Test1 />,
  },
  {
    tab: "示例3",
    key: "3",
    children: <Test3 />,
  },
];

const App = () => {
  return <CustomTabs data={data} />;
};
export default React.memo(App);
