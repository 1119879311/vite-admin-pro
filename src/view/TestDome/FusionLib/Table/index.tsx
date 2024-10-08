import React from "react";
import CustomTabs, { ITabItemsProps } from "../../Common/Tabs";
import Test1 from "./Test/Test1";
import Test2 from "./Test/Test2";
const data: ITabItemsProps[] = [
  {
    tab: "多表头1",
    key: "1",
    children: <Test1 />,
  },
  {
    tab: "多表头2",
    key: "2",
    children: <Test2 />,
  },
];

const App = () => {
  return <CustomTabs data={data} />;
};
export default React.memo(App);
