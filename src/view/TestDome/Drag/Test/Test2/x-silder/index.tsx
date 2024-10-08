import React from "react";
import DragContainer from "../components/DragContainer";
import controlList from "../data/controlList";
import { Collapse } from "antd";
import "./index.less";
const { Panel } = Collapse;
interface XSilderProps {}

interface XSilderState {}

class XSilder extends React.Component<XSilderProps, XSilderState> {
  constructor(props: XSilderProps) {
    super(props);
  }

  dragOption = {
    ghostClass: "x-render-sortable-drag",
    fallbackClass: "x-render-sortable-drag", // 正在被拖拽中的css类名
    group: {
      name: "x-control-sortable",
      pull: "clone", //"clone",
      put: false, // 不允许拖拽进这个列表
    },
    animation: 150,
    sort: false, // 设为false，禁止sort
  };

  renderItem = (list) => {
    return list.map((item) => (
      <div
        className="control-list-item"
        key={item.id}
        data-id={item.id}
        data-item={JSON.stringify(item)}
      >
        {item.title}
      </div>
    ));
  };

  renderGroup = (list) => {
    return list.map((item) => {
      return (
        <Collapse
          key={item.id}
          defaultActiveKey={["1"]}
          className="control-list-group"
        >
          <Panel header={item.title} key="1">
            <DragContainer dragOption={this.dragOption}>
              {this.renderItem(item.children || [])}
            </DragContainer>
          </Panel>
        </Collapse>
      );
    });
  };

  render() {
    return (
      <div className="x-silder-control-warp">
        {this.renderGroup(controlList)}
      </div>
    );
  }
}

export default XSilder;
