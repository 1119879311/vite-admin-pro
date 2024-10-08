import { EventMouseRightKey } from "../constants";
import { IcurrentMarkData, Ipoint } from "../types";
import { throttle } from "../util";
import { BaseBehavior } from "./baseBehaviors";

export class DrawBehavior extends BaseBehavior {
  name: string = "DrawBehavior";
  startPos: Ipoint = { x: 0, y: 0 };
  lastPos: Ipoint = { x: 0, y: 0 };

  drawing: boolean = false;

  constructor(markInstance, option = { isMouseRightSave: true }) {
    super(markInstance, option);
    this.priority = 2;
    this.eventHandlerMap = {
      "mouse:down": "onMouseDown",
      "mouse:up": "onMouseUp",
      "object:moving": "onObjectChange",
      "object:scaling": "onObjectChange",
      "object:modified": "onObjectChange",
    };
  }
  onMouseDown = (opt) => {
    if (opt.button == 1) {
      // 左键
      return this.onMouseDownLeft(opt);
    }
    if (opt.button == 3) {
      // 右键
      return this.onMouseDownRight(opt);
    }
  };

  // 鼠标右按下
  onMouseDownRight = async (opt) => {
    // 进行保存操作
    let isContinueExe = this.executionHandler("onMouseDownRight", opt);
    this.markInstance.eventManager.emit(EventMouseRightKey, {
      markTarget: opt?.target?.toObject(),
      currentMarkData: this.markInstance.currentMarkData,
    });

    if (isContinueExe !== -1) {
      // 没有提供私有方法处理，使用通用的保存操作
      return isContinueExe;
    }

    // 是否开启右键进行保存(对应绘制和编辑的)
    if (!this.option.isMouseRightSave || !this.markInstance.currentMarkData) {
      return;
    }
    // 调用完成绘制前的钩子
    const { beforeRenderHooK } = this.option;
    let result: any;
    if (typeof beforeRenderHooK == "function") {
      let result = await beforeRenderHooK.call(
        this,
        this.markInstance.currentMarkData,
        opt
      );
      if (result === false) {
        // 取消保存
        return false;
      }
    }
    this.markInstance.save(result || {});
  };

  /**
   * 鼠标左按下
   */
  onMouseDownLeft = (opt) => {
    // button: 1-左键；2-中键；3-右键
    // if (opt.button !== 1) {
    //   return;
    // }
    const { altKey } = opt.e as MouseEvent;
    // 判断是否按下altkey ，属于拖拽
    if (altKey) {
      return;
    }

    // 当前有正在激活的对象，不能绘制

    let activeObj = this.markInstance.canvasIns.getActiveObject();
    let { drawType } =
      this.markInstance.currentMarkData || ({} as IcurrentMarkData);
    if (drawType == "edit") {
      return false;
    }
    if (activeObj) {
      return false;
    }
    this.startPos = { ...opt.absolutePointer };
    this.lastPos = { ...this.startPos };
    this.drawing = true; // 开启绘制

    let isContinueExe = this.executionHandler("onMouseDown", opt);
    if (isContinueExe === -1) {
      this.drawing = false;
    } else {
      this.markInstance.canvasIns.on("mouse:move", this.onMouseMove);
    }
    return false;
  };
  onMouseMove = throttle((opt) => {
    // 这是拖拽移动的

    if (!this.drawing) {
      return;
    }
    this.lastPos = { ...opt.absolutePointer };
    this.executionHandler("onMouseMove", opt);

    // const { clientX, clientY } = opt.e as MouseEvent;
  }, 10);

  /**
   * 松开鼠标
   * @param opt
   */
  onMouseUp = (opt) => {
    if (!this.drawing) {
      return;
    }
    this.executionHandler("onMouseUp", opt);
    this.lastPos = { ...opt.absolutePointer };
    this.drawing = false;
    this.markInstance.canvasIns.off("mouse:move", this.onMouseMove);
    return false;
  };

  onObjectChange = throttle((opt) => {
    console.log("onObjectChange", opt);
    this.executionHandler("onObjectChange", opt);
    return false;
  }, 50);

  // 调具体的mark 中的方法
  executionHandler = (eventName, e: fabric.IEvent): number => {
    let { markPluginsManager, drawOption } = this.markInstance;
    const { markType } = drawOption || {};
    // const { markType } = (e.target || {}) as any;

    if (!markType || !markPluginsManager.markPlugins.has(markType)) {
      return -1; // 不执行该行为
    }
    let pluginIns = markPluginsManager.markPlugins.get(markType);
    console.log("pluginIns", pluginIns);
    if (!pluginIns[eventName]) {
      return -1;
    }
    let res = pluginIns[eventName]?.(e, this);
    if (res === false) {
      return 0; // 不执行该事件
    }
    return 1; // 继续往下执行所有行为中该事件
  };
}
