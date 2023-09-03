import CustomTabs,{ITabItemsProps} from "../Common/Tabs"
import Test1 from "./test1";
import Test2 from "./test2";

import "./index.less"
const data: ITabItemsProps[] = [
  {
    tab: "示例1",
    key: "1",
    children: <Test1/>,
  },
  {
    tab: "示例2",
    key: "2",
    children: <Test2/>,
  },
];

export default () => {
  return (
    <CustomTabs data={data}/>
  );
};
