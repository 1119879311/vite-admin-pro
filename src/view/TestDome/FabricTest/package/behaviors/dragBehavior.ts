import { EMouseCursor, Ipoint } from "../types";
import { BaseBehavior } from "./baseBehaviors";
import { fabric } from "fabric";
export class DragBehavior extends BaseBehavior {
  name: string = "DragBehavior";
  startPos: Ipoint = { x: 0, y: 0 };
  lastPos: Ipoint = { x: 0, y: 0 };

  dragging: boolean = false;

  constructor(markInstance) {
    super(markInstance);
    this.eventHandlerMap = {
      "mouse:down": "onMouseDown",
      "mouse:up": "onMouseUp",
    };
  }

  /**
   * 鼠标按下
   */
  onMouseDown = (opt) => {
    // button: 1-左键；2-中键；3-右键

    if (opt.button !== 1) {
      return;
    }
    const canvasIns = this.markInstance.canvasIns;

    const { clientX, clientY } = opt.e as MouseEvent;
    this.startPos = { x: clientX, y: clientY };
    this.lastPos = { ...this.startPos };
    // 拖拽图像的
    this.dragging = true;
    const moveCursor = EMouseCursor.POINTER;
    this.markInstance.toggelMouseCursor({
      hoverCursor: moveCursor,
      moveCursor: moveCursor,
    });
    canvasIns.on("mouse:move", this.onMouseMove);
    this.markInstance.historyManager.add(this.lastPos);

    return false;
  };
  onMouseMove = (opt) => {
    // 这是拖拽移动的
    if (!this.dragging) {
      return false;
    }
    const { clientX, clientY } = opt.e as MouseEvent;
    const delta = new fabric.Point(
      clientX - this.lastPos.x,
      clientY - this.lastPos.y
    );
    this.markInstance.canvasIns.relativePan(delta);
    this.lastPos = { x: clientX, y: clientY };
    return false;
  };

  /**
   * 松开鼠标
   * @param opt
   */
  onMouseUp = (opt) => {
    const { clientX, clientY } = opt.e as MouseEvent;
    this.lastPos = { x: clientX, y: clientY };
    if (this.dragging) {
      this.dragging = false;
      this.markInstance.toggelMouseCursor();
      return false;
    }
  };
}
