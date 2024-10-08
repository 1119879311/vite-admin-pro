import CustomTabs, { ITabItemsProps } from "../Common/Tabs";
import Test1 from "./test1";
import Test2 from "./test2";

import "./index.less";
import Test3 from "./test3";
const data: ITabItemsProps[] = [
  {
    tab: "示例1",
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

export default () => {
  return <CustomTabs data={data} />;
};
