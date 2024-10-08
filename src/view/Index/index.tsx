import { Suspense, useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import Layout from "../../components/layout--/index/index";
import Silder from "../../components/layout--/silder";

interface IAppProps {}

const App = () => {
  let [isLoading, setLoading] = useState(false);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoading(true);
  //   }, 0);
  // }, []);
  return (
    <div>index</div>
    // <Layout
    //   header={<div>管理后台</div>}
    //   sider={
    //     <Silder></Silder>
    //   }
    //   tabs={<div>tabs</div>}
    // >
    //   <Suspense fallback={<div>loading...</div>}>
    //     <Outlet></Outlet>
    //   </Suspense>
    // </Layout>
  );
};

export default App;
