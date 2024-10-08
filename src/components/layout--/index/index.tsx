import { Suspense, useEffect, useState, Fragment, FC } from "react";
import { Outlet, Link } from "react-router-dom";
import Layout from "../layout";
import Silder from "../silder";
import { Spin } from "antd";

interface IAppProps {}

const App: FC<IAppProps> = () => {
  let [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 0);
  }, []);
  return (
    <Fragment>
      {loading ? (
        <Spin spinning={loading} className="by-layout-loading"></Spin>
      ) : (
        <Layout
          header={<div>管理后台</div>}
          sider={<Silder></Silder>}
          // tabs={<div>tabs</div>}
        >
          <Suspense fallback={<div>loading...</div>}>
            <Outlet></Outlet>
          </Suspense>
        </Layout>
      )}
    </Fragment>
  );
};

export default App;
