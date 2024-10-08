import React, { ReactElement } from "react";
import DragContainer from "./DragContainer";
import widgetList from "../index";
import XOperation from "./Operation";
import RowBox from "../Box";
class DragSorTableItem extends React.Component<any, any> {
  render = () => {
    const { parentIndex, currentIndex, selectId, onAction, item, dragOption } =
      this.props;
    let { id, name, children, attr = {}, warpAttr = {} } = item as any;
    let selected = selectId === id;
    let newCurrentIndex =
      parentIndex === undefined
        ? `${currentIndex}`
        : `${parentIndex}-${currentIndex}`;
    let renderChild: ReactElement | null = null;
    if (children) {
      renderChild = (
        <DragContainer
          dragOption={dragOption}
          onAction={onAction}
          index={newCurrentIndex}
          selectId={selectId}
          list={children}
          {...attr}
        ></DragContainer>
      );
    } else if (widgetList[name]) {
      let TargetConponent: any = widgetList[name];
      renderChild = <TargetConponent {...attr} />;
    }
    if (!renderChild) {
      return null;
    }

    return (
      <div
        {...warpAttr}
        className={`x-render-list-item ${selected ? "selected" : ""} ${
          warpAttr.className || ""
        }`}
        key={id}
        data-index={newCurrentIndex}
        data-control-id={id}
      >
        <XOperation
          onAction={onAction}
          item={item}
          parentIndex={parentIndex}
          index={currentIndex}
          path={newCurrentIndex}
        />
        {renderChild}
      </div>
    );
  };
}

export default DragSorTableItem;
