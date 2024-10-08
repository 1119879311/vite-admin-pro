import { Button, message } from "antd";
import { Canvas, ICanvasOptions } from "fabric/fabric-impl";
import { fabric } from "fabric";
import { CustomEvent } from "./package/events";

/**
 * 加载图片资源
 * @param url
 * @returns
 */

export function loadImage(url: string): Promise<HTMLImageElement> {
  const imgIns = new Image();
  imgIns.src = url;
  return new Promise((resolve, reject) => {
    imgIns.onload = () => {
      resolve(imgIns);
    };
    imgIns.onerror = (error) => {
      reject(error);
    };
  });
}

type IeleSize = {
  width: number;
  height: number;
};
export function getImageSize(imgIns: HTMLImageElement): IeleSize {
  const width = imgIns.width;
  const height = imgIns.height;
  return { width, height };
}

/**
 * 获取通用节点的大小
 * @param ele
 * @returns
 */
export function getElementSize(ele: Element): IeleSize {
  const sizes = ele?.getBoundingClientRect();
  const width = sizes?.width as number;
  const height = sizes?.height as number;
  return { width, height };
}

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
  actionType: "moveing" | "eidt" | "" = "";
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
    this.actionType = "";
  }

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
    console.log("----", padding, imageSize, canvasSize);
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
    this.createRect();
    this.createLine();
    this.renderCliping();
  }

  createRect() {
    const rect = new fabric.Rect({
      width: 100,
      height: 100,
      top: 0,
      left: 0,
      fill: "rgba(255,0,0,0.5)",
      selectable: true,
    });
    this.canvasIns?.add(rect);
  }

  // 创建虚线
  createLine() {
    const pointList = this.splitGetPointLine({});
    for (let index = 0; index < pointList.length; index++) {
      const point = pointList[index];
      const dashedLine = new fabric.Line(point, {
        stroke: "#1efafb", // 浅绿色
        strokeWidth: 5, // 线宽
        strokeDashArray: [6, 4], // 虚线的模式，数字分别表示线长和间隔长度
        selectable: false, // 如果不想让用户选中虚线，设置为false
      });
      // 将虚线添加到画布
      this.canvasIns?.add(dashedLine);
    }
  }

  splitGetPointLine = (config: {
    m?: number;
    n?: number;
    mscale?: number;
    nscale?: number;
  }) => {
    const { m = 4, n = 4, mscale = 0.1, nscale = 0.1 } = config;

    if (!this.imageEle) {
      return [];
    }

    const { width, height } = this.imageEle;
    let diffWidth = (width / m) * mscale;

    let diffHeight = (height / n) * nscale;

    let verticalLines: any[] = [];
    let horizontalLines: any[] = [];

    // 计算垂直分割线的坐标
    for (let i = 1; i < n; i++) {
      let x = (width / n) * i;
      if (diffWidth > 0) {
        let diffx1 = x - diffWidth;
        let diffx2 = x + diffWidth;
        verticalLines.push([
          diffx1,
          0 - diffHeight,
          diffx1,
          height + diffHeight,
        ]);
        verticalLines.push([
          diffx2,
          0 - diffHeight,
          diffx2,
          height + diffHeight,
        ]);
      } else {
        verticalLines.push([x, 0, x, height]);
      }
    }

    // 计算水平分割线的坐标
    for (let i = 1; i < m; i++) {
      let y = (height / m) * i;
      if (diffHeight > 0) {
        let diffy1 = y - diffHeight;
        let diffy2 = y + diffHeight;
        horizontalLines.push([
          0 - diffWidth,
          diffy1,
          width + diffWidth,
          diffy1,
        ]);
        horizontalLines.push([
          0 - diffWidth,
          diffy2,
          width + diffWidth,
          diffy2,
        ]);
      } else {
        horizontalLines.push([0, y, width, y]);
      }
    }
    console.log("diffWidth", diffWidth, width + diffWidth);
    const rect = new fabric.Rect({
      left: 0 - diffWidth,
      top: 0 - diffHeight,
      width: width + diffWidth * 2,
      height: height + diffHeight * 2,
      fill: "#999", // "rgba(0,0,0,0.6)", // 半透明蓝色背景
      stroke: "#1efafb", // 浅绿色
      strokeWidth: 5, // 线宽
      strokeDashArray: [6, 4], // 虚线的模式，数字分别表示线长和间隔长度

      // globalCompositeOperation: "destination-out", // 使重叠区域透明
      selectable: false,
    });

    // 为矩形设置交集外可见、交集内透明的绘制模式
    this.canvasIns?.add(rect);
    this.canvasIns?.sendToBack(rect);
    // this.canvasIns?.add(rectOverlap);

    return [...verticalLines, ...horizontalLines];
  };

  renderCliping = () => {
    if (!this.imageEle) {
      return;
    }
    const { width, height } = this.imageEle;
    const rect = new fabric.Rect({
      width,
      height,
      top: 0,
      left: 0,
      fill: "rgba(0,0,0,0.8)",
      selectable: false,
      data: { markType: "roi", isClipBg: true },
      // clipPath: new fabric.Rect({
      //   width: 200,
      //   height: 200,
      //   top: 0,
      //   left: 0,
      //   absolutePositioned: true,
      // }),
    });

    let cliping = new fabric.Group(
      [
        new fabric.Rect({
          width: 200,
          height: 200,
          top: 0,
          left: 0,
          absolutePositioned: true,
          selectable: false,
        }),
        new fabric.Rect({
          width: 200,
          height: 200,
          top: 300,
          left: 300,
          absolutePositioned: true,
          selectable: false,
        }),
      ],
      {
        selectable: false,
        absolutePositioned: true,
        inverted: true, //颠倒裁剪
      }
    );
    // cliping.inverted = true; // 颠倒裁剪
    rect.set("clipPath", cliping);
    this.canvasIns?.add(rect);
    this.canvasIns?.add(
      new fabric.Rect({
        width: 200,
        height: 200,
        top: 0,
        left: 0,
        absolutePositioned: true,
        fill: "rgba(0,0,0,0)", // 默认透明填充
        stroke: "#1efafb", // 浅绿色
        strokeWidth: 5, // 线宽
      })
    );
    this.canvasIns?.add(
      new fabric.Rect({
        width: 200,
        height: 200,
        top: 300,
        left: 300,
        absolutePositioned: true,
        fill: "rgba(0,0,0,0)", // 默认透明填充
        stroke: "#1efafb", // 浅绿色
        strokeWidth: 5, // 线宽
      })
    );
    this.canvasIns?.renderAll();
  };
}
