export interface IcurrentMarkData {
  markData: Record<string, any>;
  shapeData: fabric.Object[];
  drawType: "edit" | "add"; // 编辑还是新建

  [key: string]: any;
}
export enum actionMode {
  DRAW = "DRAW", // 绘制模式
  DRAG = "DRAG", // 拖动模式
  DISABLE = "DISABLE", // 禁用模式
  EMPTY = "", // 空
}

export interface Ipoint {
  x: number;
  y: number;
}

// 光标类型

// 鼠标光标类型
export enum EMouseCursor {
  DEFAULT = "default", // 默认光标
  AUTO = "auto", // 默认。浏览器设置的光标。
  CROSSHAIR = "crosshair", // 光标呈现为十字线。
  POINTER = "pointer", // 光标呈现为指示链接的指针（一只手）
  MOVE = "move ", //  此光标指示某对象可被移动。
  E_RESIZE = "e-resize ", //  此光标指示矩形框的边缘可被向右（东）移动
  NE_RESIZE = "ne-resize", // 此光标指示矩形框的边缘可被向上及向右移动（北/东）
  NW_RESIZE = "nw-resize ", //  此光标指示矩形框的边缘可被向上及向左移动（北/西）
  N_RESIZE = "n-resize", // 此光标指示矩形框的边缘可被向上（北）移动
  SE_RESIZE = "se-resize ", //  此光标指示矩形框的边缘可被向下及向右移动（南/东）
  SW_RESIZE = "sw-resize", // 此光标指示矩形框的边缘可被向下及向左移动（南/西）
  S_RESIZE = "s-resize ", //  此光标指示矩形框的边缘可被向下移动（南）
  W_RESIZE = "w-resize", // 此光标指示矩形框的边缘可被向左移动（西）
  TEXT = "text", // 此光标指示文本
  WAIT = "wait", // 此光标指示程序正忙（通常是一只表或沙漏）。
  HELP = "help", // 此光标指示可用的帮助
  GRAB = "grab", // 可抓取
  GRABBING = "grabbing", // 抓取中
  DISABLED = "not-allowed", // 禁用
}

// 事件类型
export type EventName =
  | "object:modified"
  | "object:moving"
  | "object:scaling"
  | "object:rotating"
  | "object:skewing"
  | "object:resizing"
  | "object:selected"
  | "object:added"
  | "object:removed"
  | "group:selected"
  | "before:transform"
  | "before:selection:cleared"
  | "selection:cleared"
  | "selection:created"
  | "selection:updated"
  | "mouse:up"
  | "mouse:down"
  | "mouse:move"
  | "mouse:up:before"
  | "mouse:down:before"
  | "mouse:move:before"
  | "mouse:dblclick"
  | "mouse:wheel"
  | "mouse:over"
  | "mouse:out"
  | "drop:before"
  | "drop"
  | "dragover"
  | "dragenter"
  | "dragleave"
  | "before:render"
  | "after:render"
  | "before:path:created"
  | "path:created"
  | "canvas:cleared"
  | "moving"
  | "scaling"
  | "rotating"
  | "skewing"
  | "resizing"
  | "mouseup"
  | "mousedown"
  | "mousemove"
  | "mouseup:before"
  | "mousedown:before"
  | "mousemove:before"
  | "mousedblclick"
  | "mousewheel"
  | "mouseover"
  | "mouseout"
  | "drop:before"
  | "drop"
  | "dragover"
  | "dragenter"
  | "dragleave";
