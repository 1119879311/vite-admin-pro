import React from "react";
import DragContainerItem from "./DragContainerItem";
import DragContainer from "../../components/DragContainer";
class DragSortable extends React.Component<any, any> {
  render() {
    const {
      list = [],
      index,
      dragOption,
      selectId,
      onAction,
      className = "",
      ...attr
    } = this.props;
    return (
      <DragContainer
        className={`x-render-list-group ${className || ""}`}
        parentIndex={index}
        dragOption={dragOption}
        {...attr}
      >
        {list.map((item, i) => (
          <DragContainerItem
            dragOption={dragOption}
            key={item.id}
            parentIndex={index}
            currentIndex={i}
            selectId={selectId}
            onAction={onAction}
            item={item}
          />
        ))}
      </DragContainer>
    );
  }
}

export default DragSortable;
