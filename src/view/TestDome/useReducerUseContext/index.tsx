

import React from "react";
import CustomTabs, { ITabItemsProps } from "../Common/Tabs";

import Test1 from "./test1"
import Test2 from "./test2"

const data: ITabItemsProps[] = [
  {
    tab: "示例",
    key: "1",
    children: <div>
        <Test1 />
        {/* <hr></hr>
        <Test2 /> */}

    </div>,
  },
  {
  tab: "示例2",
  key: "2",
  children: <Test2 />,
},
  
];

const App = () => {
  return <CustomTabs data={data} />;
};


export default React.memo(App);
