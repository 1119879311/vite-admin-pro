import React, { PropsWithChildren } from "react";
import { Layout } from "antd";
import ByHideScrollbar from "../ByHidescrollbar";
import "./index.less";

const { Header, Sider, Content, Footer } = Layout;

interface IAppProps {
  header?: React.ReactNode | null;
  tabs?: React.ReactNode | null;
  sider?: React.ReactNode | null;
  footer?: React.ReactNode | null;
}
const BasicLayout = ({
  children,
  tabs,
  header,
  sider,
  footer,
}: PropsWithChildren<IAppProps>) => {
  console.log("children",children)
  return (
    <Layout className="by-layout-main">
      {header && <Header className="by-layout-header">{header}</Header>}
      <Layout>
        {sider && <Sider collapsible  className="by-layout-sider">{sider}</Sider>}
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
export default BasicLayout;
