import { Mark } from "..";
import { EMouseCursor } from "../types";
export class BaseMark {
  static shapeType: string = ""; // 添加一个静态属性，通用的类型
  public graphType: string = ""; // 图形类型，与业务无关,矩形，多边形，三角形等...
  markType: string = ""; // 默认 具体的业务类型
  instance: Mark;
  data: any[] = [];
  option: any = {};
  constructor(instance, option: Record<string, any> = { markType: "" }) {
    this.instance = instance;
    this.data = [];
    this.option = option;
    option.markType && (this.markType = option.markType);
  }
  render(data: any, option?: any) {
    throw new Error("请实现具体图形的渲染方法render");
  }

  onMouseUp = (opt) => {
    let { currentMarkData } = this.instance;
    // console.log("currentMarkData", currentMarkData);
    if (!currentMarkData) {
      return;
    }
    let { shapeData } = currentMarkData || {};
    if (!shapeData[0]) {
      return;
    }
    this.instance.setActive(shapeData[0]);
    // shapeData[0].set({
    //   selectable: true,
    //   hoverCursor: EMouseCursor.POINTER,
    //   moveCursor: EMouseCursor.MOVE,
    // }); // 将对象的selectable属性设置为true
    // this.instance.canvasIns.setActiveObject(shapeData[0]); // 设置对象为活动对象
    // this.instance.canvasIns.requestRenderAll();
  };

  /**
   * 对象变形操作:放大缩小，移动等
   * @param opt
   * @param type  drag | scale,scaleX,scaleY
   * @returns
   */
  onObjectChange = (opt: fabric.IEvent, type?: string) => {
    if (!opt.target) {
      return;
    }
    let { left = 0, top = 0, scaleX = 1, scaleY = 1 } = opt.target;

    let updateAttr: Record<string, any> = { left, top };
    // 只要矩形才有宽高：
    switch (this.graphType) {
      case "Rect":
        let { width = 0, height = 0 } = opt.target;
        updateAttr = {
          ...updateAttr,
          width: width * scaleX,
          height: height * scaleY,
        };
        break;
    }

    let currentMarkData = this.instance.currentMarkData;

    if (currentMarkData) {
      // 更新当前编辑的属性
      let { markData } = currentMarkData;
      currentMarkData.markData = { ...markData, ...updateAttr };
      this.instance.setCurrentMarkData(currentMarkData);
    }
  };

  setData = (data: any[]) => {
    this.data = data;
  };
}
