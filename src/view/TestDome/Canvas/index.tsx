import CustomTabs,{ITabItemsProps} from "../Common/Tabs"
import Test1 from "./Test1";
import Test2 from "./Test2";

import "./index.less"
const data: ITabItemsProps[] = [
  {
    tab: "示例1",
    key: "1",
    children: <Test2/>,
  },
  {
    tab: "示例2",
    key: "2",
    children: <Test1/>,
  },
];

export default () => {
  return (
    <CustomTabs data={data}/>
  );
};
