import  React, {  MutableRefObject, useCallback, useEffect, useRef } from "react"
import {fabric} from "fabric"
import { Canvas } from "fabric/fabric-impl"

const useResizeObserver = (taragetRef:MutableRefObject<Element|null>,callback:Function)=>{
    useEffect(()=>{
        if(!taragetRef.current){
            return
        }
        const resizeObj =  new ResizeObserver((entries)=>{
            for (const entry  of entries) {
                if (entry.contentRect) {
                   callback(entry)
                }
            }
        })
        resizeObj.observe(taragetRef.current as HTMLDivElement)
        return ()=>{
            if(taragetRef.current){
                resizeObj.unobserve(taragetRef.current as HTMLDivElement);
            }
        }
        

    },[taragetRef])

} 

const App:React.FC<{}> = ()=>{
    
    const canvasWarpRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef(null)
    const canvasIns = useRef<Canvas>();
    const resizeCallback = useCallback((entry)=>{
        canvasIns.current?.setWidth(entry.contentRect?.width as number)
        canvasIns.current?.setHeight(entry.contentRect?.height as number)
    },[canvasIns])

    useResizeObserver(canvasWarpRef,resizeCallback)
    useEffect(()=>{
        const warpRect = canvasWarpRef.current?.getBoundingClientRect();
       
        canvasIns.current = new fabric.Canvas(canvasRef?.current,{
            width:warpRect?.width,
            height:warpRect?.height
        })

        var polyLine = new fabric.Polyline([
            { x: 500, y: 20 },
            { x: 550, y: 60 },
            { x: 550, y: 200 },
            { x: 350, y: 100 },
            { x: 350, y: 60 },
         ], {
            stroke: "orange",
            fill: "white",
            strokeWidth: 5,
            name: "Polyline instance",
         });
   
        canvasIns.current.add(polyLine);

    },[])

    return <div className="height-full custom-canvas-warp">
     <div className="height-full tool-left">工具</div>
     <div className="height-full canvas-bg-2 flex-auto" ref={canvasWarpRef}>
        <canvas ref={canvasRef}></canvas>
    </div>

    </div>
}

export default React.memo(App)