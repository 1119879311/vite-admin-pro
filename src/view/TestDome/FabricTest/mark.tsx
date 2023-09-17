import { message } from "antd";
import { Canvas, ICanvasOptions } from "fabric/fabric-impl";
import { fabric } from "fabric";

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
export function getImageSize(imgIns: HTMLImageElement | HTMLCanvasElement): IeleSize {
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
  const height = (sizes?.height as number);
  return { width, height };
}




export class Mark {

  canvasIns: Canvas | undefined; // 画布实例
  canvasRef: HTMLCanvasElement | undefined; // 画布节点
  canvasWarpRef: Element | undefined; // 画布节点外层节点
  imageEle: HTMLImageElement | undefined; // 图片实例
  imageStatus: "ERROR" | "LOADING" | "SUCCESS" = "LOADING";

  initZoom:number = 1
  padleft: number = 50;
  padTop: number = 50;

  constructor(
    canvasRef: HTMLCanvasElement,
    canvasWarpRef: Element,
    options: ICanvasOptions
  ) {
    this.canvasWarpRef = canvasWarpRef;
    this.canvasIns = new fabric.Canvas(canvasRef, {
      ...getElementSize(this.canvasWarpRef),
    //   allowTouchScrolling:true,
      centeredScaling: true,
      isDrawingMode:true,
      ...options,
    });
  }

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

    const imgInstance = new fabric.Image(result, {
      selectable: false,
      crossOrigin: "anonymous",
      //   scaleX:baseScale,
      //   scaleY:baseScale
    });
    // const scaleImage = getCanvasWithImageScaleX(getElementSize(this.canvasWarpRef as HTMLElement),getImageSize(result));
    // // 如果比例小于1, 说明图片大于canvans的大小，要以最小的比例进行缩小
 
    const { baseScale } = this.getCanvasWithImageScale({padLeft:this.padleft,padTop:this.padTop});
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
    console.log("----",padding,imageSize,canvasSize)
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
    const zoom  = this.canvasIns?.getZoom() as number;
    const canvasSize = getElementSize(this.canvasWarpRef as HTMLElement);
    const imageSize = getImageSize(this.imageEle as HTMLImageElement)
    const padleft = (canvasSize.width-imageSize.width*zoom)/2;
    const padlTop= (canvasSize.height-imageSize.height*zoom)/2;


     console.log("--setPostionCenter-----",padleft,padlTop,zoom,canvasSize,imageSize)
    this.canvasIns?.absolutePan({ x: -padleft, y: -padlTop });
  };
  
  setZoom(zoom){
    if(zoom<0.1){
        zoom = 0.1
    }else if(zoom>5){
        zoom = 5;
    }
    this.canvasIns?.setZoom(zoom);
    this.setPostionCenter()
  }

  upZoom=()=>{
    let zoom = this.canvasIns?.getZoom() as number;
    this.setZoom(zoom+0.05)
  }
  downZoom=()=>{
    let zoom = this.canvasIns?.getZoom() as number;
    this.setZoom(zoom-0.05)
  }

  /**
   * 添加图形
   */
  addShape() {
    const rect = new fabric.Rect({
      width: 100,
      height: 100,
      top: 100,
      left: 100,
      fill: "rgba(255,0,0,0.5)",
    });
    this.canvasIns?.add(rect);
  }
}

