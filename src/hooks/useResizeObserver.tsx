import { MutableRefObject, useEffect } from "react"
import {debounce} from "@/utils"
export const useResizeObserver = (taragetRef:MutableRefObject<Element|null>,callback:Function,time:number=500)=>{
    useEffect(()=>{
        if(!taragetRef.current){
            return
        }
        const resizeObj =  new ResizeObserver(debounce((entries)=>{
            for (const entry  of entries) {
                if (entry.contentRect) {
                   callback(entry)
                }
            }
        },time))
        resizeObj.observe(taragetRef.current as HTMLDivElement)
        return ()=>{
            if(taragetRef.current){
                resizeObj.unobserve(taragetRef.current as HTMLDivElement);
            }
        }
        

    },[taragetRef])

} 