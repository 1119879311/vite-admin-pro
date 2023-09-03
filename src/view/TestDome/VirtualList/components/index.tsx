import { CSSProperties,forwardRef, FC, ReactNode, useCallback, useEffect, useMemo, useRef, useState, useImperativeHandle } from "react";
import "./index.less"
import React from "react";

interface IProps {
    data:any[],
    rowKey:string,
    renderItem:(...arg:any)=>ReactNode | ReactNode
    itemSize:number,
    layout:"horizontal" | "vertical"
    totals:number,
    prenderCount?:number
    [key:string]:any
}

function throttle(func, wait) {
    let timer;
    return function(_this:unknown) {
      if (!timer) {
        let args = arguments;
        timer = setTimeout(() => {
          func.apply(_this, args);
          timer = null;
        }, wait);
      }
    }
  }




export type IVirtualListForward = {
    goPage:(index:number)=>void,
    goIndex:(index:number)=>void,
    getViewCounts:()=>number,
    getPageCounts:()=>number,

}

const App= forwardRef<IVirtualListForward,IProps>(({data=[],layout='vertical',rowKey='key',renderItem,totals=0,itemSize= 60,prenderCount=2},ref) => {
    const container  = useRef<HTMLDivElement>(null)
    const scrollPhantom  = useRef<HTMLDivElement>(null)
    const viewCounts = useRef(0)

    const [renderlist,setRenderList] = useState<any[]>([]);
    const [viewTransform,setViewTransform] = useState<CSSProperties>({});
    const [viewListStyle,setviewListStyle] = useState<CSSProperties>({});
    const [itmeStyle] = useState<CSSProperties>(layout==="horizontal"?{width:itemSize}:{height:itemSize});
    


    const  isHorizontal  = useMemo(()=>layout==="horizontal",[layout]);

    const  nodeAttrs = useMemo(()=>{
        return isHorizontal?{'scroll':'scrollLeft',"client":"clientWidth"}:{"scroll":"scrollTop","client":"clientHeight"};
    },[isHorizontal])


    useEffect(()=>{
        const target = container.current;
        if(!target){
            return
        }
        viewCounts.current =  Math.ceil(target[nodeAttrs.client] /itemSize); 
        const resizeObserver = new ResizeObserver(()=>{
            if(target){
                viewCounts.current =  Math.ceil(target[nodeAttrs.client] /itemSize); 
                updateViews(target)
            }
        })
        resizeObserver.observe(container.current);
        return ()=>{
            container.current&&resizeObserver.observe(container.current);
        }
    },[container.current,nodeAttrs,itemSize])


    // 共有几页
    const pageCounts = useMemo(()=>{

        return Math.ceil(totals/viewCounts.current);

    },[totals,viewCounts.current])


  

    useImperativeHandle(ref,()=>({
        // 跳到第几页
        goPage:(page:number)=>{

            // 一页多少个
            // 计算当前可以显示的个数

            const target = container.current;
             if(!target){
                return
            }
           
          
            if(page===0){
                return   target.scrollTo({ top:0,left:0})
            }
            
           
            let scrollLen = target[nodeAttrs.scroll] || 0;
           
            // 一页多长,等于或者大于可视化宽度
            let viewLen = viewCounts.current * itemSize;

            page = page>pageCounts?pageCounts:page;

            // console.log("pageCounts",pageCounts,viewCounts.current)
            // 计算当前处于第几页的
            let diffLen =page * viewLen + scrollLen%viewLen;

            if(viewLen>target[nodeAttrs.client]){ // 真实要显示的大于可视区域，要减去一个
                diffLen  = diffLen-itemSize
            }
            // console.log("diffLen",index,diffLen)
            // 要滚动到的位置
            const options = isHorizontal?{left:diffLen,top:0}:{left:0,top:diffLen}
            target.scrollTo(options)

        },
        goIndex:(index:number)=>{
            const target = container.current;
            if(!target){
               return
           }
    
            let scrollLen = target[nodeAttrs.scroll] || 0;
            let startIndexBase = Math.floor(scrollLen/itemSize);
            // 误差两个就进行滚动处理
            let startIndex = startIndexBase +2; 
            //判断当前是否在可视化区域
            let endIndex = startIndexBase + viewCounts.current -2;

            // console.log("---",index,startIndex,endIndex,index>=startIndex && index<endIndex)
            if(index>=startIndex && index<endIndex){
                return
            }
          
            const diffPageCount = index / viewCounts.current;

            // console.log("---",diffPageCount,diffPageCount<0 || index<viewCounts.current-1)
            if(diffPageCount<0 || index<viewCounts.current-1){
                return    target.scrollTo({ top:0,left:0})
            }
            let indexLen =index * itemSize
            if(startIndex>=index){
                indexLen = indexLen + (viewCounts.current -1)* itemSize;
            }else{
                indexLen = indexLen +  2 * itemSize;
            }
          
            let clentLen = target[nodeAttrs.client];
            let diffLen = indexLen - clentLen;
            const options = isHorizontal?{left:diffLen,top:0}:{left:0,top:diffLen}
            target.scrollTo(options)
             
        },
        getViewCounts:()=>viewCounts.current,
        getPageCounts:()=>pageCounts,

    }))

    useEffect(()=>{
        const attr = layout==="horizontal"?'width':"height";
        if(scrollPhantom.current){
            scrollPhantom.current.style[attr] = (totals * itemSize) +"px"
        }
        
    },[totals,itemSize,scrollPhantom,layout])

    useEffect(()=>{
        if(container.current){
            updateViews(container.current)
            const handlescroll = throttle(function(e){
                updateViews(e.target)
            },100)
            container.current.addEventListener("scroll",handlescroll)
            return ()=>{
                container.current?.removeEventListener("scroll",handlescroll)
            }
        }
    },[viewCounts.current])

    const updateViews = useCallback((target:HTMLDivElement)=>{
       
        requestAnimationFrame(()=>{
    
            let scrollLen = target[nodeAttrs.scroll] || 0;
           
            let startIndex = Math.floor(scrollLen/itemSize);// prevStartIndex;
             startIndex = startIndex<0?0:startIndex
           
    
            //计算当前可视区域显示的结束索引endIndex(相对总数的索引)
            let endIndex = startIndex + viewCounts.current + prenderCount;
    
            let outScoll = 0;//prenderCount * itemSize;
          
            
            let renderData = data.slice(startIndex,endIndex)
            const listLen = (itemSize*(viewCounts.current+prenderCount)) + "px";  
            if(scrollLen>0 && ( endIndex>=totals || endIndex+viewCounts.current>=totals)){
                outScoll = viewCounts.current * itemSize - target[nodeAttrs.client] ;
            }
           
            const transform = isHorizontal?`translate3d(${scrollLen}px,0px, 0px)`:`translate3d(0px, ${scrollLen}px, 0px)`;

            // console.log("scrollLen",outScoll,scrollLen,totals,startIndex,viewCounts.current,endIndex,itemSize * totals,endIndex*itemSize)
            setviewListStyle(isHorizontal?{width:listLen,transform:`translate3d(-${outScoll}px,0px, 0px)`}:{height:listLen,transform:`translate3d(0px, -${outScoll}px, 0px)`})
            setViewTransform({transform})
            setRenderList(renderData)
        })
        


    },[viewCounts.current])

  return (
    <div className={`virtualList_contianer ${layout}`} ref={container}>
      <div className="virtualList_scroll-phantom" ref={scrollPhantom}></div>
      <div className="virtualList_scroll-views" style={viewTransform}>
        <div className="virtualList_scroll-list" style={viewListStyle}>
        {renderlist.map(item=>{
            return  <div key={item[rowKey]} className={`virtualList_item`} style={itmeStyle}>
                {renderItem && renderItem(item)}
            </div>
        })}
        </div>
       
      </div>
    </div>
  );
});

export default  (App) ;
