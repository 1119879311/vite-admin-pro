import React, { PropsWithChildren } from "react";
import { Layout } from "antd";
import ByHideScrollbar from "@components/ByHidescrollbar";
import "./index.less";

const { Header, Sider, Content, Footer } = Layout;

interface IAppProps {
  header?: React.ReactNode | null;
  tabs?: React.ReactNode | null;
  sider?: React.ReactNode | null;
  footer?: React.ReactNode | null;
}
const App = ({
  children,
  tabs,
  header,
  sider,
  footer,
}: PropsWithChildren<IAppProps>) => {
  return (
    <Layout className="by-layout-main">
      {header && <Header className="by-layout-header">{header}</Header>}
      <Layout>
        {sider && <Sider className="by-layout-sider">{sider}</Sider>}
        <Layout>
          {tabs}
          <Content className="by-layout-contents">
            <ByHideScrollbar y={true}>{children}</ByHideScrollbar>
          </Content>
          {footer && <Footer>{footer}</Footer>}
        </Layout>
      </Layout>
    </Layout>
  );
};
export default App;
