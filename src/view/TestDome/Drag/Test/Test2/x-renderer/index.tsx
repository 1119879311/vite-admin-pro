import { useState, Component } from "react";
import DragContainer from "../widgets/Container";
import DragSortable from "./DragSortable";
import renderList from "../data/renderList";
import { Button } from "antd";
import {
  getPathIndex,
  getSelectItemData,
  onHandleAdd,
  onHandleCopy,
  onHandleDelete,
  onHandleSort,
} from "./utils";
import { parseJson } from "@/utils/heper";
import "./index.less";
import { XOperationenum } from "./types";
import RowBox from "../widgets/Box";
import React from "react";
interface XRenderProps {
  [key: string]: any;
}

interface XRenderState {}

class XRender extends React.Component<XRenderProps, XRenderState> {
  domRef: React.RefObject<HTMLDivElement>;
  constructor(props) {
    super(props);
    this.domRef = React.createRef<HTMLDivElement>();
  }
  state = {
    updateKey: 0,
    renderData: JSON.parse(JSON.stringify(renderList)),
    selectId: undefined,
    selectItemData: null,
  };
  defaultSortTableOption = {
    animation: 150,
    fallbackOnBody: true,
    swapThreshold: 0.65,
    // handle: ".x-render-drag-action",
    ghostClass: "x-render-sortable-ghost", // drop placeholder的css类名
    chosenClass: "x-render-sortable-chosen", // 被选中项的css 类名
    dragClass: "x-render-sortable-drag", // 正在被拖拽中的css类名
    group: {
      name: "x-render-sortable",
      pull: true,
      put: ["x-render-sortable", "x-control-sortable"],
    },
    onChoose: (option) => this.onChoose(option),
    onEnd: (option) => this.onDragEnd(option),
    onAdd: (option) => this.onAdd(option),
  };
  onChoose = (option) => {
    console.log("controlId", option);
    let { item, oldIndex } = option;
    let toParentIndex = this.getEleDataSetData(item, "parentIndex");
    let [toPathArr] = getPathIndex(oldIndex, toParentIndex);
    let { children, ...selectItemData } = getSelectItemData(
      this.state.renderData,
      {
        paths: toPathArr,
        index: oldIndex,
      }
    );

    this.props.onSelect?.(selectItemData);
    // this.setState({
    //   selectItemData,
    //   selectId: selectItemData.id,
    // });
  };
  onAdd = (option) => {
    if (option.pullMode !== "clone") {
      return;
    }
    let { clone, to, newIndex } = option;

    let addItem = parseJson(this.getEleDataSetData(clone, "item"));

    if (!addItem) {
      return;
    }
    let toParentIndex = this.getEleDataSetData(to, "parentIndex");
    let [toPathArr] = getPathIndex(newIndex, toParentIndex);
    let newData = onHandleAdd(this.state.renderData, addItem, toPathArr);
    this.setState({
      renderData: newData,
    });
  };
  onDragEnd = (option) => {
    // console.log("onEnd", option, [...option.to.classList]);

    let { item, newIndex, oldIndex, from, to } = option;
    let toParentIndex = this.getEleDataSetData(to, "parentIndex");
    let formParentIndex = this.getEleDataSetData(from, "parentIndex");
    let [toPathArr, toPathStr] = getPathIndex(newIndex, toParentIndex);
    let [formPathArr, formPathStr] = getPathIndex(oldIndex, formParentIndex);
    if (toPathStr === formPathStr) {
      console.log("位置不变");
      return;
    }
    // 跨级处理；// 删除原来的，然后新增
    let newData = onHandleSort(
      this.state.renderData,
      toPathArr,
      formPathArr,
      toParentIndex,
      formParentIndex
    );
    // 同级处理：
    this.setState({ renderData: newData, updateKey: this.state.updateKey + 1 });
  };

  getEleDataSetData = (item, field = "id") => {
    return item.dataset[field];
  };
  onAction = (type, option) => {
    console.log("type", type, option);
    if (type === XOperationenum.DELETE) {
      let newRenderData = onHandleDelete(this.state.renderData, {
        path: option.path,
      });
      this.setState({ renderData: newRenderData });
      return;
    }
    if (type === XOperationenum.COPY) {
      let newRenderData = onHandleCopy(
        this.state.renderData,
        option.item,
        option.path
      );
      this.setState({ renderData: newRenderData });
    }
  };
  onSubmit = () => {
    console.log("onSubmit", this.state.renderData);
  };
  componentDidMount(): void {
    console.log("this.domRef", this.domRef);
  }
  render() {
    const { renderData } = this.state;
    const { selectId } = this.props;
    // console.log("renderData", renderData);
    return (
      <div>
        <RowBox
          ref={this.domRef}
          color="red"
          alignItems="center"
          display="flex"
          justifyContent="center"
          option={{
            "data-id": 12,
            onClick: () => {
              console.log(1212);
            },
          }}
        >
          123123
        </RowBox>
        <Button onClick={this.onSubmit}>保存</Button>
        <DragContainer
          onAction={this.onAction}
          dragOption={this.defaultSortTableOption}
          list={renderData}
          selectId={selectId}
          className="x-root-drag-container"
        ></DragContainer>
      </div>
    );
  }
}

export default XRender;
