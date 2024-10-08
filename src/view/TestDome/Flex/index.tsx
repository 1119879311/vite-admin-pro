import React from "react";
import CustomTabs, { ITabItemsProps } from "../Common/Tabs";
import { LayoutTest1 } from "./Test/Test1";
const data: ITabItemsProps[] = [
  {
    tab: "示例",
    key: "1",
    children: <LayoutTest1 />,
  },
];

const App = () => {
  return <CustomTabs data={data} />;
};
export default React.memo(App);
