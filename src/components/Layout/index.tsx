
import { Suspense,  PropsWithChildren } from "react";

import BasicLayout from "./BasicLayout";
import Header from "./Header";
import Silder from "./Silder";
import {Spin} from "antd"
import Footer from "./Footer";
import "./index.less"
interface IAppProps {
    loading?:boolean,
    isHeader?:boolean,
    isSider?:boolean,
    isFooter?:boolean,
    leftMenu?:any[],
    headMenu?:any[],
    headerInfo?:any
}

const App = ({loading, children,isHeader=true,isSider=true,isFooter=true,leftMenu}: PropsWithChildren<IAppProps>) => {
   
  return <>{loading ? 
        <Spin spinning={loading}  className="by-layout-loading"></Spin> : (
        <BasicLayout
         header={isHeader &&<Header/>}
         sider={isSider &&<Silder data={leftMenu}/>}
         footer={isSider &&<Footer/>}
        >
        <Suspense fallback={<div>loading...</div>}>
           {children}
        </Suspense>
        </BasicLayout> 
        )}

     </>
  
};

export default App;
