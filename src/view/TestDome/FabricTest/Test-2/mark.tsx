import { Button, message } from "antd";
import { Canvas, ICanvasOptions } from "fabric/fabric-impl";
import { fabric } from "fabric";
import { CustomEvent } from "../package/events";
import { getElementSize, getImageSize, loadImage } from "../util";
// import "../cliper";
import ClipperLib from "clipper-lib";
import "./util-1.js";

import * as MockData from "./mock";
import {
  computeCompilePoly,
  getUnionPolyTree,
  getValidOuterRegions,
  isPolygonCompletelyInValidArea,
  pointToLowerCase,
} from "./utii";
import { actionMode } from "../package/types";

fabric.Object.prototype.transparentCorners = false; // 控制点的颜色
fabric.Object.prototype.cornerStyle = "circle"; // 控制点的形状
fabric.Object.prototype.cornerColor = "#1efafb";
fabric.Object.prototype.cornerSize = 10; // 控制点的大小
fabric.Object.prototype.borderColor = "#1efafb"; // 边框的颜色
fabric.Object.prototype.cornerStrokeColor = "#1efafb";
fabric.Object.prototype.borderDashArray = [3, 3];
export class Mark {
  canvasIns: Canvas | undefined; // 画布实例
  canvasRef: HTMLCanvasElement | undefined; // 画布节点
  canvasWarpRef: Element | undefined; // 画布节点外层节点
  imageEle: HTMLImageElement | undefined; // 图片实例
  imageStatus: "ERROR" | "LOADING" | "SUCCESS" = "LOADING";

  initZoom: number = 1;
  padleft: number = 50;
  padTop: number = 50;
  actionMode: actionMode;
  constructor(
    canvasRef: HTMLCanvasElement,
    canvasWarpRef: Element,
    options: ICanvasOptions
  ) {
    this.canvasWarpRef = canvasWarpRef;
    this.canvasRef = canvasRef;
    this.canvasIns = new fabric.Canvas(canvasRef, {
      ...getElementSize(this.canvasWarpRef),
      //   allowTouchScrolling:true,
      // centeredScaling: true,
      fireRightClick: true, // 启用右键，button的数字为3
      stopContextMenu: true, // 禁止默认右键菜单
      isDrawingMode: false,
      ...options,
    });
    this.actionMode = actionMode.DRAG;
  }

  setActionMode = (value: actionMode) => {
    this.actionMode = value;
  };

  initEvent = () => {
    if (!this.canvasIns) {
      return;
    }
    new CustomEvent(this);
  };

  /**
   * 加载图片实例
   */
  initImage = async (src: string) => {
    this.imageStatus = "LOADING";
    let result: HTMLImageElement | undefined = await loadImage(src).catch(
      () => undefined
    );
    this.imageEle = result;
    if (!result) {
      message.error(`图片加载失败: [ ${src} ]`);
      this.imageStatus = "ERROR";
      return;
    }
    this.imageStatus = "SUCCESS";
    const { width, height } = result;
    const imgInstance = new fabric.Image(result, {
      selectable: false,
      crossOrigin: "anonymous",
      left: 0,
      top: 0,
      width,
      height,
      originX: "left",
      originY: "top",
      data: { isImageShape: true },
      //   scaleX:baseScale,
      //   scaleY:baseScale
    });
    // const scaleImage = getCanvasWithImageScaleX(getElementSize(this.canvasWarpRef as HTMLElement),getImageSize(result));
    // // 如果比例小于1, 说明图片大于canvans的大小，要以最小的比例进行缩小

    const { baseScale } = this.getCanvasWithImageScale({
      padLeft: this.padleft,
      padTop: this.padTop,
    });
    this.initZoom = baseScale;
    this.canvasIns?.setZoom(baseScale);

    console.log(
      "scaleImage",
      baseScale,
      this.canvasIns?.getZoom(),
      this.canvasIns
    );
    this.canvasIns?.add(imgInstance);

    this.setPostionCenter();
    this.renderShape();
    this.initEvent();
  };

  getCanvasWithImageScale(padding = { padLeft: 0, padTop: 0 }): {
    scaleX: number;
    scaleY: number;
    baseScale: number;
  } {
    const canvasSize = getElementSize(this.canvasWarpRef as HTMLElement);
    const imageSize = getImageSize(this.imageEle as HTMLImageElement);
    const scaleX = (canvasSize.width - padding.padLeft * 2) / imageSize.width;
    const scaleY = (canvasSize.height - padding.padTop * 2) / imageSize.height;
    // 如果比例小于1, 说明图片大于canvans的大小，要以最小的比例进行缩小
    let baseScale = 1; //基准缩放比例
    if (scaleX < 1 || scaleY < 1) {
      baseScale = scaleX > scaleY ? scaleY : scaleX;
    }

    return { scaleX, scaleY, baseScale };
  }

  renderShape() {
    this.canvasIns?.renderAll();
    this.addShape();
  }
  /**
   * 计算图片的缩放数据和偏移
   * 设置居中位置
   */

  setPostionCenter = () => {
    const zoom = this.canvasIns?.getZoom() as number;
    const canvasSize = getElementSize(this.canvasWarpRef as HTMLElement);
    const imageSize = getImageSize(this.imageEle as HTMLImageElement);
    const padleft = (canvasSize.width - imageSize.width * zoom) / 2;
    const padlTop = (canvasSize.height - imageSize.height * zoom) / 2;
    const centerPoint = new fabric.Point(-padleft, -padlTop);

    this.canvasIns?.absolutePan(centerPoint);
  };

  setZoom(zoom, isCenter = true) {
    if (zoom < 0.1) {
      zoom = 0.1;
    } else if (zoom > 5) {
      zoom = 5;
    }
    this.canvasIns?.setZoom(zoom);
    isCenter && this.setPostionCenter();
  }

  upZoom = () => {
    let zoom = this.canvasIns?.getZoom() as number;
    this.setZoom(zoom + 0.05);
  };
  downZoom = () => {
    let zoom = this.canvasIns?.getZoom() as number;
    this.setZoom(zoom - 0.05);
  };

  /**
   * 添加图形
   */
  addShape() {
    const canvas = this.canvasIns;
    if (!canvas) {
      return;
    }
    const { outerRegions, innerRegions, isCheckInvalidArea } =
      computeCompilePoly(MockData.rectangles);

    const isInValidArea = isCheckInvalidArea(MockData.testPolygon, "Polygon");
    console.log("多边形是否在有效区域内", isInValidArea);
    const isInLineValidArea = isCheckInvalidArea(
      MockData.testLineSegment,
      "Polyline"
    );
    console.log("线是否在有效区域内", isInLineValidArea);
    const isInPointValidArea = isCheckInvalidArea(
      MockData.testPoint,
      "Polypoint"
    );
    console.log("点是否在有效区域内", isInPointValidArea);
    this.renderUnionPoly(outerRegions, innerRegions);
    this.renderTestPoly();
  }

  /**
   * 渲染合拼后的多边形
   * @param outerRegions
   */
  renderUnionPoly(outerRegions, innerPolygons) {
    //有效的外环
    [...outerRegions].forEach((path) => {
      var polygon = new fabric.Polygon(
        path.map((p) => ({ x: p.X, y: p.Y })),
        {
          fill: "rgba(0,0,0,0)", // 半透明的填充色
          stroke: "red", // 边框颜色
          strokeWidth: 3, // 边框宽度
          selectable: false, // 设置为不可选择
        }
      );
      this.canvasIns?.add(polygon);
    });

    // 无效的内环
    [...innerPolygons].forEach((path) => {
      var polygon = new fabric.Polygon(
        path.map((p) => ({ x: p.X, y: p.Y })),
        {
          fill: "rgba(0,0,0,0)", // 半透明的填充色
          stroke: "rgba(0,0,0,1)", // 边框颜色
          strokeWidth: 3, // 边框宽度
          selectable: false, // 设置为不可选择
        }
      );
      this.canvasIns?.add(polygon);
    });
  }

  /**
   * 渲染测试数据
   */
  renderTestPoly() {
    const { testPoint, testPolygon, testLineSegment } = MockData;

    /**
     * 绘制点
     */

    var point = new fabric.Circle({
      radius: 5, // 圆形的半径，如果想要更小的点，可以设置更小的值
      fill: "blue", // 填充颜色
      left: testPoint.X - 5, // 横坐标位置
      top: testPoint.Y - 5, // 纵坐标位置
      selectable: false,
    });

    // 将点添加到画布上
    this.canvasIns?.add(point);

    /**
     * 绘制折线
     */

    const verticalLine = new fabric.Polyline(
      pointToLowerCase(testLineSegment),
      {
        stroke: "blue",
        strokeWidth: 5,
        selectable: false,
      }
    );
    this.canvasIns?.add(verticalLine);

    /**
     * 绘制多边形
     */

    [testPolygon].forEach((item) => {
      var polygon = new fabric.Polygon(pointToLowerCase(item), {
        fill: "blue", // 半透明的填充色
        stroke: "blue", // 边框颜色
        strokeWidth: 1, // 边框宽度
        selectable: false, // 设置为不可选择
      });

      this.canvasIns?.add(polygon);
    });
  }
}
