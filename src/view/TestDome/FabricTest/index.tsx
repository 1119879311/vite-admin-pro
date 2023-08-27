import CustomTabs,{ITabItemsProps} from "../Common/Tabs"
import Test1 from "./Test-1";
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
    children: <div>222</div>,
  },
];

export default () => {
  return (
    <CustomTabs data={data}/>
  );
};
