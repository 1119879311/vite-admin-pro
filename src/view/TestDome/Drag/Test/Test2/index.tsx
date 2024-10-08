import { useState, Component } from "react";
import XRender from "./x-renderer";
import { Col, Row } from "antd";
import XSilder from "./x-silder";
import XSetting from "./x-setting";
import React from "react";
interface IProps {}

interface IState {
  selectData: any;
}

class App extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      selectData: {},
    };
  }
  onSelect = (data) => {
    this.setState({
      selectData: data,
    });
  };
  render() {
    const { selectData } = this.state;
    return (
      <div>
        <Row gutter={[16, 24]} wrap={false}>
          <Col flex={"200px"}>
            <XSilder />
          </Col>
          <Col flex={"auto"}>
            <XRender onSelect={this.onSelect} selectId={selectData.id} />
          </Col>
          <Col flex={"200px"}>
            <XSetting selectData={selectData} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default App;
