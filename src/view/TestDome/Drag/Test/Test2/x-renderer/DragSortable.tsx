import React from "react";
import DragSorTableItem from "./DragSorTableItem";
import DragContainer from "../components/DragContainer";
class DragSortable extends React.Component<any, any> {
  render() {
    const {
      list = [],
      parentIndex,
      dragOption,
      selectId,
      onAction,
      className = "",
      ...baseProps
    } = this.props;
    return (
      <DragContainer
        className={`x-render-list-group ${className}`}
        parentIndex={this.props.parentIndex}
        dragOption={dragOption}
        {...baseProps}
      >
        <DragSorTableItem
          onAction={onAction}
          list={list}
          parentIndex={parentIndex}
          dragOption={dragOption}
          selectId={selectId}
        />
      </DragContainer>
    );
  }
}

export default DragSortable;
