import React, {
  PropsWithChildren,
} from "react";
import { Layout } from "antd";
import ByHideScrollbar from "../../by-hidescrollbar";
import "./index.less";

const { Header, Sider, Content, Footer } = Layout;

interface IAppProps {
  header?: React.ReactNode | null;
  tabs?: React.ReactNode | null;
  sider?: React.ReactNode | null;
}
const App = ({
  children,
  tabs,
  header,
  sider,
}: PropsWithChildren<IAppProps>) => {
  return (
        <Layout className="by-layout-main">
          <Header className="by-layout-header">{header}</Header>
          <Layout>
            <Sider className="by-layout-sider">
            {sider}
              {/* <ByHideScrollbar></ByHideScrollbar> */}
            </Sider>
            <Layout>
              {tabs}
              <Content className="by-layout-contents">
                <ByHideScrollbar y={true}>{children}</ByHideScrollbar>
              </Content>
              <Footer>Footer</Footer>
            </Layout>
          </Layout>
        </Layout>
 
  );
};
export default App;
