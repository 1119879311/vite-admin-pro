// import fabric from "fabric/fabric-impl";
import { fabric } from "fabric";
import { Mark } from "../index";
import { Ipoint, actionMode } from "../types";
export class CustomEvent {
  instance: Mark;
  startPos: Ipoint = { x: 0, y: 0 };
  lastPos: Ipoint = { x: 0, y: 0 };
  lastPosX: number | null = 0;
  lastPosY: number | null = 0;
  dragging: boolean = false;
  zoomDelta = 0.05;
  constructor(instance) {
    this.instance = instance;
    this.resigerEvent();
  }
  resigerEvent() {
    const canvas = this.instance.canvasIns;
    if (!canvas) {
      return;
    }

    // canvas.on("mouse:down", this.onMouseDownBase);
    // // canvas.on("mouse:move", this.onMouseMove);
    // canvas.on("mouse:up", this.onMouseUp);
    // canvas.on("mouse:wheel", this.onMouseWheel);
    // canvas.on("mouse:scaling", this.onScaling);
    canvas.on("object:scaling", this.onScaling);
    // canvas.on("object:modified", (opt) => {
    //   console.log("modified", opt);
    // });
    // canvas.on("object:selected", (opt) => {
    //   console.log("selected", opt);
    // });
    // canvas.on("object:removed", (opt) => {
    //   console.log("removed", opt);
    // });
    // canvas.on("object:added", (opt) => {
    //   console.log("added", opt);
    // });
    // canvas.on("object:resizing", (opt) => {
    //   console.log("resizing", opt);
    // });
    // canvas.on("object:moving", (opt) => {
    //   console.log("moving", opt);
    // });
  }

  // 鼠标按下， 左右中
  onMouseDownBase = (opt) => {
    // button: 1-左键；2-中键；3-右键
    // console.log("按下", opt);
    if (opt.button === 1) {
      this.onMouseDown(opt);
    } else if (opt.button === 3) {
      this.onContextMenu(opt);
    }
  };
  /**
   * 左键按下
   */
  onMouseDown = (opt) => {
    const _this = this.instance;
    const canvasIns = _this.canvasIns;
    if (!canvasIns) {
      return;
    }
    const { altKey, clientX, clientY } = opt.e as MouseEvent;

    this.startPos = { x: clientX, y: clientY };
    this.lastPos = { ...this.startPos };
    // 拖拽图像的
    if (altKey || _this.actionMode == actionMode.DRAG) {
      this.dragging = true;
      canvasIns.on("mouse:move", this.onMouseMove);
      return;
    }
  };
  onMouseMove = (opt) => {
    // 这是拖拽移动的
    if (this.dragging) {
      const _this = this.instance;
      if (this.lastPosX !== null && this.lastPosY !== null) {
        const { clientX, clientY } = opt.e as MouseEvent;
        const delta = new fabric.Point(
          clientX - this.lastPos.x,
          clientY - this.lastPos.y
        );
        _this.canvasIns!.relativePan(delta);
        this.lastPos = { x: clientX, y: clientY };
      }
      return;
    }
  };

  /**
   * 松开鼠标
   * @param opt
   */
  onMouseUp = (opt) => {
    // const _this = this.instance;
    const { clientX, clientY } = opt.e as MouseEvent;
    this.lastPos = { x: clientX, y: clientY };
    if (this.dragging) {
      this.dragging = false;
      const _this = this.instance;
      const canvasIns = _this.canvasIns;
      canvasIns?.off("mouse:move", this.onMouseMove);
    }
  };

  // 右键按下
  onContextMenu = (opt) => {
    const _this = this.instance;
    const canvasIns = _this.canvasIns;
    const data = (opt.target as any).data;

    if (!opt.target || !canvasIns || data?.isImageShape) {
      return;
    }
    const is_static_ = opt.target.get("_static_");

    if (is_static_) {
      return;
    }
    // console.log("opt.target", opt.target);
    opt.target.set("selectable", true); // 将对象的selectable属性设置为true
    canvasIns.setActiveObject(opt.target); // 设置对象为活动对象

    canvasIns.renderAll();
  };
  onScaling = (opt) => {
    this.uniformStrokeScalingHandler(opt);
  };

  // 控制边框

  uniformStrokeScalingHandler = (e) => {
    let object = e.target;
    // 检查对象是否具有 strokeWidth 属性
    if (object.strokeWidth) {
      // 保存原始的边框宽度，如果它还未定义（即第一次缩放时）
      if (!object.originalStrokeWidth) {
        object.originalStrokeWidth = object.strokeWidth;
      }
      // 根据最初的缩放值计算新的 strokeWidth 值
      let newStrokeWidth = object.originalStrokeWidth / object.scaleX;
      // 更新 strokeWidth 值

      let maxBorderwidth = 5;
      if (newStrokeWidth > maxBorderwidth) {
        newStrokeWidth = maxBorderwidth;
      }

      object.set("strokeWidth", newStrokeWidth);
    }
  };
}
