import React from "react";
import { SortableEvent } from "react-sortablejs";
import Sortable from "sortablejs";
import { createCustoms, insertNodes, removeNodes } from "./util";
class DragContainer extends React.Component<any, any> {
  ref: null | Element;
  sortableInstance: null;
  constructor(props) {
    super(props);
    this.ref = null;
    this.sortableInstance = null;
  }
  componentDidMount() {
    this.sortableInstance = Sortable.create(this.ref, {
      animation: 150,
      ...(this.getOption() || {}),
    });
  }
  componentWillUnmount() {
    this.sortableInstance && (this.sortableInstance as any).destroy();
  }
  prepareOnHandlerPropAndDOM(evtName: string): (evt: SortableEvent) => void {
    return (evt) => {
      this[evtName]?.(evt); // 复原原来的位置
      this.callOnHandlerProp(evt, evtName);
    };
  }

  prepareOnHandlerProp(evtName: string): (evt: SortableEvent) => void {
    return (evt) => {
      this.callOnHandlerProp(evt, evtName);
    };
  }

  callOnHandlerProp = (evt: SortableEvent, evtName: string): void => {
    let { dragOption = {} } = this.props;
    const propEvent = dragOption[evtName];
    // console.log("propEvent",evtName, propEvent, dragOption);
    if (propEvent) propEvent(evt, this.sortableInstance);
  };
  getOption = () => {
    let { dragOption = {} } = this.props;
    let newOptions = { ...dragOption };
    // 操作节点复原的
    const DOMHandlers: string[] = [
      "onAdd",
      "onChoose",
      "onDeselect",
      "onEnd",
      "onRemove",
      "onSelect",
      "onSpill",
      "onStart",
      "onUnchoose",
      "onUpdate",
    ];
    const NonDOMHandlers: string[] = [
      "onChange",
      "onClone",
      "onFilter",
      "onSort",
    ];
    DOMHandlers.forEach(
      (name) => (newOptions[name] = this.prepareOnHandlerPropAndDOM(name))
    );
    NonDOMHandlers.forEach(
      (name) => (newOptions[name] = this.prepareOnHandlerProp(name))
    );
    return newOptions;
  };

  onRemove = (option) => {
    // 删除就要复原
    // 判断是否是克隆的，克隆的就不要处理
    console.log("onRemove", option);
    if (option.pullMode == "clone") {
      return;
    }
    insertNodes(createCustoms(option));
  };
  onAdd = (option) => {
    console.log("onAdd--", option);
    removeNodes(createCustoms(option));
  };
  onUpdate = (option) => {
    console.log("onUpdate--", option);
    // 同级排序的更新，// 要考虑是否交互位置
    const customs = createCustoms(option); //
    removeNodes(customs); // 删除新增的（新索引）
    insertNodes(customs); // 复原，原来的位置索引
  };
  render() {
    const {
      parentIndex,
      className = "",
      children,
      dragOption,
      ...baseProps
    } = this.props;

    return (
      <div
        className={`darg-container ${className}`}
        data-parent-index={parentIndex}
        {...baseProps}
        ref={(ref) => (this.ref = ref)}
      >
        {children}
      </div>
    );
  }
}

export default DragContainer;
