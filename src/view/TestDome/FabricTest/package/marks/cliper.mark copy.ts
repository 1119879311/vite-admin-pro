import { fabric } from "fabric";

import { BaseMark } from "./base.mark";
import { addUid } from "../util";

interface IConfig {
  // boxOption: any;
  // isClipShape: boolean; // 是否要渲染裁切区域
  markType: string;
  id: number;
  data?: any[]; // 图形数据
  [key: string]: any;
}
const defaultROIStrokeWidth = 5;
const defaultROIStrokeColor = "rgba(0, 255, 0, 1)"; // 默认描边颜色: 绿色
const defaultROIShadowColor = "rgba(0,0,0,0.8)"; // ROI 外区背景颜色: 阴影透明度
const defaultROIFillColor = "rgba(0,0,0,0)"; // 填充颜色: 透明
const defaultClipAnnoOption = {
  absolutePositioned: false,
  // inverted: true,
  selectable: false,
  rotatingPointOffset: 0,
};
export class ClipMark extends BaseMark {
  static shapeType: string = "Cliper"; // 添加一个静态属性，通用的类型

  markType: string = "Cliper"; // 默认 具体的业务类型

  constructor(instance, option: Record<string, any> = { markType: "Cliper" }) {
    super(instance, option);
  }

  /**
   * 1. 相对图像
   * 2. 相对当前
   */

  /**
   * 入口渲染
   */
  render(config: IConfig) {
    let {
      markType = "",
      id,
      isClipShape = true,
      data = [],
      ...boxOption
    } = config || {};
    this.data = data;
    let clipList: fabric.Object[] = [];
    let shapeList: fabric.Object[] = [];

    const { top, left, ...boxParams } = boxOption;
    data.forEach((item) => {
      let clipItem = this.renderClip({
        ...item,
        left: item.left + left,
        top: item.top + top,
        absolutePositioned: true,
      });
      clipItem && clipList.push(clipItem);
      if ((isClipShape || item.isClipShape) && item.isClipShape !== false) {
        let shapeItem = this.renderClip({
          ...item,
          absolutePositioned: false,
          fill: defaultROIFillColor,
        });
        shapeItem && shapeList.push(shapeItem);
      }
    });

    let boxShape = this.renderShaowBox({
      ...boxParams,
      top: 0,
      left: 0,
      id: addUid(),
      absolutePositioned: false,
      objectCaching: false,
      clipPath: clipList.length
        ? new fabric.Group(clipList, {
            selectable: false,
            absolutePositioned: true,
            inverted: true, //颠倒裁剪
          })
        : undefined,
    });

    let shapeGourp = new fabric.Group([boxShape, ...shapeList], {
      top,
      left,
      ...defaultClipAnnoOption,
      absolutePositioned: false,
      /** @ts-ignore  */
      id: id,
      _static_: true,
    });

    this.instance?.canvasIns?.add(shapeGourp);
    // this.instance?.canvasIns?.moveTo(shapeGourp, 1);
    shapeGourp.moveTo(1);
    return shapeGourp;
  }

  /**
   * 渲染外层
   */
  renderShaowBox(option: any = {}) {
    return new fabric.Rect({
      ...option,
      stroke: option.strokeColor || defaultROIStrokeColor,
      strokeWidth: option.strokeWidth || defaultROIStrokeWidth,
      fill: option.fillColor || defaultROIShadowColor, // Shadow 区域背景
      ...defaultClipAnnoOption,
    });
  }

  /**
   * 渲染生成裁切图形
   */
  renderClip(option: any) {
    let { markType, ...data } = option;
    switch (markType) {
      case "Rect":
        return new fabric.Rect({
          // 禁止移动
          lockMovementX: true,
          lockMovementY: true,
          // 禁止缩放
          lockScalingX: true,
          lockScalingY: true,
          // 禁止倾斜
          lockSkewingX: true,
          lockSkewingY: true,
          // 禁止旋转
          lockRotation: true,

          stroke: defaultROIStrokeColor,
          strokeWidth: defaultROIStrokeWidth,
          ...defaultClipAnnoOption,
          ...data,
        });

      default:
    }
  }

  getDataSource() {
    return this.data;
  }
}
