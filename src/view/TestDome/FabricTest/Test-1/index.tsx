import  React, {   useCallback, useEffect, useRef } from "react"
import { Canvas } from "fabric/fabric-impl"
import { useResizeObserver } from "@/hooks/useResizeObserver"
import img1 from "../images/1.jpg"
import {Mark} from "../mark"



const App:React.FC<{}> = ()=>{
    
    const canvasWarpRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const canvasIns = useRef<Canvas>();
    const resizeCallback = useCallback((entry)=>{
        canvasIns.current?.setWidth(entry.contentRect?.width as number)
        canvasIns.current?.setHeight(entry.contentRect?.height as number)
    },[canvasIns])

    useResizeObserver(canvasWarpRef,resizeCallback)
    useEffect(()=>{

        const markIns = new Mark(canvasRef.current as HTMLCanvasElement,canvasWarpRef.current as HTMLElement,{})
        canvasIns.current = markIns.canvasIns;
        markIns.initImage(img1)
    },[])

    return <div className="height-full custom-canvas-warp">
     <div className="height-full tool-left">工具</div>
     <div className="height-full canvas-bg-2 flex-auto" ref={canvasWarpRef}>
        <canvas ref={canvasRef}></canvas>
    </div>

    </div>
}

export default React.memo(App)