import { message } from "antd";
import { Canvas, ICanvasOptions } from "fabric/fabric-impl";
import {fabric} from "fabric"


/**
 * 加载图片资源
 * @param url 
 * @returns 
 */

export function loadImage (url:string):Promise<HTMLImageElement>{
    const imgIns = new Image()
    imgIns.src=url;
    return new Promise((resolve,reject)=>{
        imgIns.onload = ()=>{
            resolve(imgIns)
        };
        imgIns.onerror=(error)=>{
           
            reject(error)
        }
    })

}

type IeleSize = {
    width:number,
    height:number,
}
export function getImageSize(imgIns:HTMLImageElement):IeleSize{
    const width = imgIns.width;
    const height = imgIns.height;
    return {width,height}
}

/**
 * 获取通用节点的大小
 * @param ele 
 * @returns 
 */
export function getElementSize(ele:Element):IeleSize{
    const sizes = ele?.getBoundingClientRect();
    const width = sizes?.width as number;
    const height = sizes?.height as number;
    return {width,height}
}

/**
 * 计算画布大小与图片大小的比例
 * @returns 
 */
export function getCanvasWithImageScaleX(canvasSize:IeleSize,imageSize:IeleSize):{scaleX:number,scaleY:number}{
    const scaleX = canvasSize.width/ imageSize.width;
    const scaleY = canvasSize.height/ imageSize.height;
    return {scaleX,scaleY}
}


export class  Mark{
 
   canvasIns:Canvas | undefined ;// 画布实例
   canvasRef:HTMLCanvasElement | undefined;// 画布节点
   canvasWarpRef: Element | undefined;// 画布节点外层节点
   imageEle:HTMLImageElement | undefined; // 图片实例
   imageStatus:"ERROR"|"LOADING"|'SUCCESS'="LOADING";
   constructor(canvasRef:HTMLCanvasElement,canvasWarpRef:Element,options:ICanvasOptions){
    this.canvasWarpRef = canvasWarpRef;
    this.canvasIns = new fabric.Canvas(canvasRef,{
        ...getElementSize(this.canvasWarpRef),
        centeredScaling:true,
        ...options
    })
   }

   /**
    * 加载图片实例
    */
   initImage= async (src:string)=>{
     
    this.imageStatus = "LOADING";
    let result: HTMLImageElement|undefined = await loadImage(src).catch(()=>undefined);
    this.imageEle = result;
    if(!result){
        message.error(`图片加载失败: [ ${src} ]` )
        this.imageStatus = "ERROR";
        return
    }
    this.imageStatus = "SUCCESS";

   
    const scaleImage = getCanvasWithImageScaleX(getElementSize(this.canvasWarpRef as HTMLElement),getImageSize(this.imageEle as HTMLImageElement));
    // 如果比例小于1, 说明图片大于canvans的大小，要以最小的比例进行缩小
    let baseScale = 1; //基准缩放比例
    if(scaleImage.scaleX<1 || scaleImage.scaleY<1){
        baseScale = scaleImage.scaleX>scaleImage.scaleY?scaleImage.scaleY:scaleImage.scaleX
    }

    const imgInstance = new fabric.Image(result, {
      selectable: false,
      crossOrigin:"anonymous",
      scaleX:baseScale,
      scaleY:baseScale
      
    });
   
    // const scaleImage = getCanvasWithImageScaleX(getElementSize(this.canvasWarpRef as HTMLElement),getImageSize(result));
    // // 如果比例小于1, 说明图片大于canvans的大小，要以最小的比例进行缩小
    // let baseScale = 1; //基准缩放比例
    // if(scaleImage.scaleX<1 || scaleImage.scaleY<1){
    //     baseScale = scaleImage.scaleX>scaleImage.scaleY?scaleImage.scaleY:scaleImage.scaleX
    // }

    // this.canvasIns?.setZoom(baseScale)

    // console.log("scaleImage",scaleImage,baseScale,this.canvasIns?.getZoom(),this.canvasIns )
    this.canvasIns?.add(imgInstance);

    this.setPostionCenter();
    

   }

   /**
    * 计算图片的缩放数据和偏移
    * 设置居中位置
    */
   
   setPostionCenter = ()=>{


    // const scaleImage = getCanvasWithImageScaleX(getElementSize(this.canvasWarpRef as HTMLElement),getImageSize(this.imageEle as HTMLImageElement));
    // // 如果比例小于1, 说明图片大于canvans的大小，要以最小的比例进行缩小
    // let baseScale = 1; //基准缩放比例
    // if(scaleImage.scaleX<1 || scaleImage.scaleY<1){
    //     baseScale = scaleImage.scaleX>scaleImage.scaleY?scaleImage.scaleY:scaleImage.scaleX
    // }
    console.log("--zoom",this.canvasIns?.getZoom() )
    // this.canvasIns?.setZoom(5)
     // 添加图形

     this.addShape();

    this.canvasIns?.renderAll();
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
        fill: 'rgba(255,0,0,0.5)'
      });
    
      this.canvasIns?.add(rect);
   }

}