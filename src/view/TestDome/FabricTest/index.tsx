import CustomTabs, { ITabItemsProps } from "../Common/Tabs";
import Test1 from "./Test-1";
import Test2 from "./Test-2";
import Test3 from "./Test-3";

import "./index.less";
const data: ITabItemsProps[] = [
  {
    tab: "示例1",
    key: "0",
    children: <Test3 />,
  },
  {
    tab: "示例2",
    key: "2",
    children: <Test1 />,
  },
  {
    tab: "示例3",
    key: "1",
    children: <Test2 />,
  },
];

export default () => {
  return <CustomTabs data={data} defaultKey="0" />;
};
