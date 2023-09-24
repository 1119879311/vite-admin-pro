
import React from "react";

import CustomTabs, { ITabItemsProps } from "../Common/Tabs";
import Test2 from "./test2";
import Test3 from "./test3";
import Test1 from "./test1";



const data: ITabItemsProps[] = [
  {
    tab: "示例",
    key: "1",
    children: <Test1 />,
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


export default React.memo(App);
