import { Button, Result } from "antd"
import VirtualList, { IVirtualListForward } from "./components/index"

import { useCallback, useEffect, useRef, useState } from "react"
import {createPortal} from "react-dom"
import testJsom from "./guaziche.json"


function addUid(){
    return `${Math.random()*10}`.replace(".",'')
}

const chacheImageMap = new Map()
const alLoad :any[]= [];
const CustomImage = ({src="",id,delay=300})=>{
    const divRef = useRef<HTMLDivElement>(null)
    useEffect(()=>{

        if(divRef.current){
            const ref = divRef.current;
            let chache = chacheImageMap.get(id);
            if(chache){
                let old = ref.childNodes[0];
                if(old && old.nodeType){
                    ref.replaceChild(chache,old)
                }else{
                    ref.appendChild(chache)
                }
                return
            }
            // createPortal(<span>加载中....</span>,ref)
            ref.innerHTML="<span class='image-loading'>加载中</span>"

            
            let timer =  setTimeout(()=>{
                alLoad.push({id,src})
                loadImage(src).then((res:any)=>{
                    chacheImageMap.set(id,res)
                    let old = ref.childNodes[0];
                    if(old && old.nodeType){
                        ref.replaceChild(res,old)
                    }else{
                        ref.appendChild(res)
                    }
                }).catch(()=>{
                    // createPortal(<span>加载失败...</span>,ref)
                    ref.innerHTML = "<span class='image-error'>加载失败</span>"
                })
            },delay)

            return ()=>{
                clearTimeout(timer)
            }
          
        }


    },[])


   return <div className="image-warp" ref={divRef}></div>
}




function loadImage(src:string){
    return new Promise((resolve,reject)=>{
        const image = new Image();
        image.src = src;
        image.onload=function(){
            resolve(this)
        }
        image.onerror = function(error){
            console.log("error",error,src)
            reject({type:"error"})
        }
       
    })
    
}

let data = testJsom.map((item,index)=>{
   const findIndex = item.carImg.indexOf("@");
   const carImg = item.carImg.substring(0,findIndex)

   return {...item,key:addUid(),carImg,index}
}).slice(0,100);//Array.from({length:1000},(_,v)=>({key:Math.random()+"",name:"name"+v}))

console.log("data",data)
const RenderItme = (props)=>{
    // console.log("ativeIndex",props.ativeIndex,props.index,props.ativeIndex===props.index)
    return <div className={`list-item ${props.ativeIndex===props.index?"is-active":""}`} onClick={()=>props.onSelect(props.index)}><CustomImage src={props.carImg} id={props.key}/>
    <div className="item-index">{props.index}</div></div>
}

const App = ()=>{
    const listRef = useRef<IVirtualListForward>(null)
    const page = useRef(0)
    const [index,setIndex] = useState<number>(0);
    const onClickPage = (type:string)=>{
       if( listRef.current){
        let oldIndex = page.current;
        console.log("page.current",oldIndex)
        if(type==="+"){
           if(oldIndex>=data.length-1){
             return
           }
           page.current = oldIndex +1;
        }else if(type==="-"){
           if(oldIndex<=0){
            return
           }
           page.current= oldIndex-1;
        }
       
        listRef.current.goPage( page.current)
       }
    }
    const onClickIndex = (type:string)=>{
        if( listRef.current){
         let newIndex = index;
      
         if(type==="+"){
            if(index>=data.length-1){
              return
            }
            newIndex = index +1;
         }else if(type==="-"){
            if(index<=0){
             return
            }
            newIndex= index-1;
         }
         console.log("index.current",newIndex)
         setIndex(newIndex)
         listRef.current.goIndex(newIndex)
        }
     }

     const onSelect = (selectIndex:number)=>{
        if(selectIndex===index){
            return
        }
        setIndex(selectIndex)
        listRef.current?.goIndex(selectIndex)
     }


    
    const onGetChacheImage = ()=>{
        console.log("chache:",chacheImageMap)
        console.log("alLoad:",alLoad)
        console.log("data:",data.length)
    }
    return <div className="test1-warp">
         <Button onClick={()=>onClickPage("-")}>上一页</Button>
         <Button onClick={()=>onClickPage("+")}>下一页</Button>
         <Button onClick={()=>onClickIndex("-")}>上一张</Button>
         <Button onClick={()=>onClickIndex("+")}>下一张</Button>
         <Button onClick={onGetChacheImage}>获取缓存图片</Button>
        <div>当前第几张：{index}</div>
  

        <VirtualList ref={listRef} data={data} rowKey="key" itemSize={150} renderItem={(itemProps)=>RenderItme({...itemProps,ativeIndex:index,onSelect:onSelect}) } layout="vertical" totals={data.length}/>
    </div>
}

export default App



// import { Button } from "antd"
// import VirtualList, { IVirtualListForward } from "./components/index"
// import { useRef } from "react"


// let data = Array.from({length:1000},(_,v)=>({key:Math.random()+"",name:"name"+v}))


// const RenderItme = (props)=>{
//     return <div className="list-item">{props.name}</div>
// }

// const App = ()=>{
//     const listRef = useRef<IVirtualListForward>(null)
//     const index = useRef(1)
//     const onClick = ()=>{
//        if( listRef.current){
//         listRef.current.goPage(index.current++)
//        }
//     }
//     return <div className="test1-warp">
//          <Button onClick={onClick}>下一页</Button>
//         <VirtualList ref={listRef} data={data} rowKey="key" itemSize={60} renderItem={RenderItme} layout={"vertical"} totals={data.length}/>
//     </div>
// }

// export default App