import { fabric } from "fabric";

import { BaseMark } from "./base.mark";
import { addUid, pointerTolineDistance } from "../util";

export class RectMark extends BaseMark {
  static shapeType: string = "Rect"; // 添加一个静态属性，通用的类型
  public graphType: string = "Rect"; // 图形类型，与业务无关

  markType: string = "Rect"; // 默认 具体的业务类型

  constructor(instance, option: Record<string, any> = { markType: "Rect" }) {
    super(instance, option);
  }
  render(data) {
    let rectIns = this.renderDetail(data);
    // 这里是组合渲染，可能有文本对象等
    this.data.push({ shapes: [rectIns], option: data });
    this.instance.canvasIns.add(rectIns);
    return rectIns;
  }

  /**
   * 这是单个对象渲染，只渲染当前编辑的，不是组合渲染
   */
  renderDetail = (data: any) => {
    const { stroke, fill, strokeWidth, ...params } = data;
    let rectIns = new fabric.Rect({
      // 禁止移动
      // lockMovementX: true,
      // lockMovementY: true,
      // 禁止缩放
      // lockScalingX: true,
      // lockScalingY: true,
      // 禁止倾斜
      lockSkewingX: true,
      lockSkewingY: true,
      // 禁止旋转
      lockRotation: true,
      selectable: false,
      fill: fill || this.option.fill || this.instance.defaultROIFillColor,
      stroke:
        stroke || this.option.stroke || this.instance.defaultROIStrokeColor,
      strokeWidth:
        strokeWidth ||
        this.option.strokeWidth ||
        this.instance.defaultROIStrokeWidth,

      ...params,
    });

    return rectIns;
  };

  onMouseDown = (e, dragBehaviorIns) => {
    console.log("开始绘制", e, dragBehaviorIns);
    let { currentMarkData } = this.instance;
    if (!currentMarkData) {
      return;
    }
    let { shapeData } = currentMarkData || {};
    this.instance.setCurrentMarkData(null);
    this.instance.canvasIns.remove(...shapeData);
    this.instance.canvasIns.requestRenderAll();
  };

  onMouseMove = (e, dragBehaviorIns) => {
    let { currentMarkData } = this.instance;
    let { startPos, lastPos } = dragBehaviorIns;

    // 不存在则创建
    let updateAttr: Record<string, any> = {
      ...pointerTolineDistance(startPos, lastPos),
    };

    // 判断是否反方向(向上，先左)
    if (startPos.x > lastPos.x) {
      updateAttr.left = lastPos.x;
    }

    if (startPos.y > lastPos.y) {
      updateAttr.top = lastPos.y;
    }

    let { fill, strokeWidth, strokeColor } = this.instance.drawOption;
    if (!currentMarkData) {
      let tempMarkValue = {
        top: startPos.y,
        left: startPos.x,
        id: addUid(),
        markType: this.markType,
        // 绘制过程优先固定，如果没有固定就动态获取
        fill: this.option.fill || fill,
        stroke: this.option.strokeWidth || strokeColor,
        strokeWidth: this.option.strokeWidth || strokeWidth,
        ...updateAttr,
      };
      let shapeData = this.renderDetail({
        top: startPos.y,
        left: startPos.x,
        ...pointerTolineDistance(startPos, lastPos),
        isRender: true,
      });
      currentMarkData = {
        drawType: "add",
        markData: { ...tempMarkValue },
        shapeData: [shapeData],
      };

      this.instance.canvasIns.add(shapeData);
    } else {
      let { shapeData, markData } = currentMarkData || {};
      currentMarkData.markData = { ...markData, ...updateAttr };
      shapeData[0]?.set(updateAttr);
    }

    this.instance.setCurrentMarkData({ ...currentMarkData, isDraw: true });

    this.instance.canvasIns.requestRenderAll();
  };
}
