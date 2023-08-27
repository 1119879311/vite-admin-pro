
import React from "react";
import { TabPaneProps, Tabs } from "antd";

import "./index.less"
const { TabPane } = Tabs;

export interface ITabItemsProps extends TabPaneProps{
    key?:string | number
}


interface IATabsProps {
    data?:ITabItemsProps[];
    className?: string;
    style?: React.CSSProperties;
}

const App:React.FC<IATabsProps>  = ({data=[],className="",style={}})=>{

  return (
    <div className={`height-full page-padding-1 ${className}`} style={style}>
      <Tabs className="height-full block-bg-1 custom-tabs-warp" defaultActiveKey="1" type="card" size="middle">
        {data.map((item) =>{
            const {children,tabKey,...itmeProps} =item;
            return  (
                <TabPane key={tabKey} tabKey={tabKey}  {...itmeProps} ><div className="height-full block-padding-1 custom-tabs-children">{children}</div></TabPane>
              )
        })}
      </Tabs>
    </div>
  );
}

export default React.memo(App)
