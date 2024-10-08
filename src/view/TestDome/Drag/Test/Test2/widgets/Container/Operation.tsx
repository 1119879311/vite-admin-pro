import { Col, Modal, Row, Space, Popconfirm } from "antd";
import { CopyOutlined, DeleteOutlined, DragOutlined } from "@ant-design/icons";
import React, { MouseEventHandler } from "react";
import { XOperationenum } from "./types";

interface XOperationProps {
  onAction?: (
    type: XOperationenum,
    props: Record<string, any>,
    e: MouseEventHandler
  ) => void;
  [key: string]: any;
}

interface XOperationState {
  [key: string]: any;
}

class XOperation extends React.Component<XOperationProps, XOperationState> {
  constructor(props: XOperationProps) {
    super(props);
  }
  onHandle = (e, type: XOperationenum) => {
    let { onAction, ...option } = this.props;
    onAction?.(type, option, e);
  };
  ondrag = (e) => {
    this.onHandle(e, XOperationenum.MOVE);
  };
  onCopy = (e) => {
    this.onHandle(e, XOperationenum.COPY);
  };
  onDelete = (e) => {
    this.onHandle(e, XOperationenum.DELETE);
  };
  render() {
    return (
      <Row className="x-render-operation" gutter={[24, 24]}>
        <Col>
          <DragOutlined className="x-render-drag-action" />
        </Col>
        <Col>
          <Popconfirm
            title="确定复制吗"
            onConfirm={this.onCopy}
            okText="确定"
            cancelText="取消"
          >
            <CopyOutlined />
          </Popconfirm>
        </Col>
        <Col>
          <Popconfirm
            title="确定删除吗"
            onConfirm={this.onDelete}
            okText="确定"
            cancelText="取消"
          >
            <DeleteOutlined />
          </Popconfirm>
        </Col>
      </Row>
    );
  }
}

export default XOperation;
