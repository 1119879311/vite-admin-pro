import  { useEffect, useRef } from "react"
import "./index.less"
import imageUrl from "../images/1.jpg"

type IPoint = {
    x:number,y:number
}

type IEleSize = {
    width:number,
    height:number
}

export function getImageOrCanvasSize(ele: HTMLImageElement | HTMLCanvasElement): IEleSize {
    const width = ele.width;
    const height = ele.height;
    return { width, height };
  }

type ICropping = [IPoint,IPoint,IPoint,IPoint] // 裁剪的坐标： 左上角坐标, 右上角坐标,右下角坐标,左下角坐标
type IClipImageConfig = {sx:number,sy:number,sWidth:number,sHeight:number};// 裁剪的配置类型

interface IDrawImageConf{
    url:string,
    canvasH?:number,
    canvasW?:number,
    // 裁剪图片的配置(正方形和矩形)，相对图片的像素坐标，不是canvas 坐标
    cropping?:ICropping
    padding?:{ // 画布渲染图片直接的边距
        offsetLeft?:number,
        offsetTop?:number
    }
    [key:string]:any
}


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
  

/**
 *  渲染图片
 */
class DrawImage{
    imageStatus:"NOLOAD" | "LOADING"|"SUCCESS" | "ERROR"="NOLOAD"
    context:CanvasRenderingContext2D | null
    canvasEle:HTMLCanvasElement | null = null
    imageEle:HTMLImageElement | null =null
    config:IDrawImageConf = {url:""}
    zoom:number=1
    baseScale:number=1 // 基于初始化渲染区域与画布的比例
    renderAreaSize:{width:number,height:number}={width:0,height:0}
    constructor(canvasEle:HTMLCanvasElement,config:IDrawImageConf){
        this.canvasEle = canvasEle;
        this.context = canvasEle.getContext("2d")
        this.config = config;
        this.init()
    }

    init(){   
        const {canvasH,canvasW,url} = this.config || {}
        this.setCanvasSize({width:canvasW,hegiht:canvasH})
        this.initImage(url);
    }
    /**
     * 设置画布大小
     * @param config 
     * @returns 
     */
    setCanvasSize (config?:{width?:number,hegiht?:number}){
        const {width,hegiht} =config || {};
        if(!this.canvasEle){
            return
        }
        if(width!==undefined){
            this.canvasEle.width = width
        }
        if(hegiht!==undefined){
            this.canvasEle.height = hegiht
        }
    }


    /**
   * 加载图片实例
   */
  initImage = async (src: string) => {
    this.imageStatus = "LOADING";
    let result: HTMLImageElement | null = await loadImage(src).catch(
      () => null
    );
    this.imageEle = result;
    if (!result) {
      this.imageStatus = "ERROR";
      return;
    }
    this.imageStatus = "SUCCESS";
    this.drawImg();
  };
  
  drawImg(){

    // drawImage(image, dx, dy);
    // drawImage(image, dx, dy, dWidth, dHeight);
    // drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  
     const cropping = this.isCropping();
     const canvaSize = getImageOrCanvasSize(this.canvasEle as HTMLCanvasElement)
     const imageEle = this.imageEle as HTMLImageElement
     // 裁剪的
     if(cropping){
        const {sx, sy, sWidth, sHeight} = this.getCroppingSize(cropping) as IClipImageConfig;
        this.getCanvasWithImageScale(canvaSize,{width:sWidth,height:sHeight});
        const {dx,dy,dWidth,dHeight} = this.getDrawImageAreaConf()
        this.context?.drawImage(imageEle,sx, sy, sWidth, sHeight,dx,dy,dWidth,dHeight)
     }else{
        // 不裁剪的
        this.getCanvasWithImageScale(canvaSize,getImageOrCanvasSize(imageEle ));
        const {dx,dy,dWidth,dHeight} = this.getDrawImageAreaConf()
        this.context?.drawImage(imageEle,dx,dy,dWidth,dHeight)
        
     }

     console.log("baseScale--",this.baseScale)
  }

  /**
   * 只考虑正四边形
   * 计算剪切图片的参数：sx, sy, sWidth, sHeight
   */
  getCroppingSize(opton:ICropping):IClipImageConfig|undefined{
    if(!opton ||!Array.isArray(opton) || opton.length!==4){
        return
    }
    const [firstPoint,twoPoint,threePoint] = opton
    const sWidth = twoPoint.x-firstPoint.x;
    const sHeight = threePoint.y-twoPoint.y;

    return {
        sx:firstPoint.x, 
        sy:firstPoint.y,
        sWidth, 
        sHeight
    }

  }
 
  /**
   * 
   * @returns 是否有剪切
   */
  isCropping():ICropping |null{
    const {cropping} = this.config
    if(!cropping ||!Array.isArray(cropping) || cropping.length!==4){
        return  null
    }
    return cropping
  }

  /**
   *  获取当前渲染的图片或者裁剪局域与 画布的比例
   * @returns 
   */
  getCanvasWithImageScale(canvasSize:IEleSize,renderAreaSize:IEleSize): {
    scaleX: number;
    scaleY: number;
    baseScale: number;
  } {

    let {width,height} = canvasSize

    const {padding} = this.config;
    if(padding){
        const {offsetTop=0,offsetLeft=0} = padding;
        width = width- offsetLeft *2;
        height = height-offsetTop * 2;
        if(width<=0){
            width = canvasSize.width;
        }
        if(height<=0){
            height= canvasSize.height;
        }
    }
    let scaleX = (width) / renderAreaSize.width;
    let scaleY = (height) / renderAreaSize.height;
    // 如果比例小于1, 说明图片大于canvans的大小，要以最小的比例进行缩小
    let baseScale = 1; //基准缩放比例
    if (scaleX < 1 || scaleY < 1) {
      baseScale = scaleX > scaleY ? scaleY : scaleX;
    }
    
    this.renderAreaSize = renderAreaSize;
    this.baseScale = baseScale;
    return { scaleX, scaleY, baseScale };
  }


  /**
   * 
   */
  getDrawImageAreaConf():{dx:number, dy:number, dWidth:number, dHeight:number}{
      const {width,height} = this.renderAreaSize;
      const {width:canvasW,height:canvasH} = this.canvasEle as HTMLCanvasElement
      const dWidth = width * this.baseScale * this.zoom
      const dHeight = height * this.baseScale * this.zoom;
      const dx = (canvasW - dWidth)/2;
      const dy= (canvasH - dHeight)/2;
      return {
        dx,dy,dHeight,dWidth
      }

  }


}

export default ()=>{
   const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(()=>{
        new DrawImage(canvasRef.current as HTMLCanvasElement,
            {url:imageUrl,
            canvasH:200,
            canvasW:200,
            padding:{offsetLeft:0,offsetTop:0},
            cropping:[
                {x:1289,y:470},
                {x:1580,y:460},
                {x:1608,y:980},
                {x:1280,y:954},

            ]
        })
    },[])
    return  <div className="box-warp">
        <div className="canvas-box">
            <canvas ref={canvasRef}></canvas>
        </div>
    </div>
}