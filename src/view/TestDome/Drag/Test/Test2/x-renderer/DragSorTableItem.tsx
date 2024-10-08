import React from "react";
import DragSortable from "./DragSortable";
import widgetList from "../widgets";
import XOperation from "./Operation";
class DragSorTableItem extends React.Component<any, any> {
  render() {
    let {
      list = [],
      dragOption = {},
      parentIndex,
      selectId,
      onAction,
    } = this.props;
    return (
      <>
        {list.map((item, index) => {
          let { id, name, attr = {}, children } = item as any;
          let selected = selectId === id;
          let currentIndex =
            parentIndex === undefined ? `${index}` : `${parentIndex}-${index}`;
          if (children) {
            return (
              <div
                className={`x-render-list-item ${selected ? "selected" : ""}`}
                key={id}
                data-index={currentIndex}
                data-control-id={id}
              >
                <XOperation
                  onAction={onAction}
                  item={item}
                  parentIndex={parentIndex}
                  index={index}
                  path={currentIndex}
                />
                <DragSortable
                  dragOption={dragOption}
                  onAction={onAction}
                  parentIndex={currentIndex}
                  list={children}
                  key={`${id}`}
                  selectId={selectId}
                  {...attr}
                ></DragSortable>
              </div>
            );
          }
          let TargetConponent: any = widgetList[name];
          return TargetConponent ? (
            <div
              className={`x-render-list-item ${selected ? "selected" : ""}`}
              key={id}
              data-index={currentIndex}
              data-control-id={id}
            >
              <XOperation
                onAction={onAction}
                item={item}
                parentIndex={parentIndex}
                index={index}
                path={currentIndex}
              />
              <TargetConponent {...attr} />
            </div>
          ) : null;
        })}
      </>
    );
  }
}

export default DragSorTableItem;
