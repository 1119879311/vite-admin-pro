import { Button, Result } from "antd"
import VirtualList, { IVirtualListForward } from "./components/index"

import { useCallback, useEffect, useRef, useState } from "react"
import {createPortal} from "react-dom"
import testJsom from "./guaziche.json"


const loadingStr =`<svg t="1693740679122" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5495" width="40" height="40"><path d="M463.99488 32.01024m48.00512 0l0 0q48.00512 0 48.00512 48.00512l0 159.98976q0 48.00512-48.00512 48.00512l0 0q-48.00512 0-48.00512-48.00512l0-159.98976q0-48.00512 48.00512-48.00512Z" fill="#424242" p-id="5496"></path><path d="M783.765799 113.449535m36.774055 30.857096l0 0q36.774055 30.857096 5.916959 67.631152l-102.839435 122.559267q-30.857096 36.774055-67.631152 5.916959l0 0q-36.774055-30.857096-5.916959-67.631152l102.839435-122.559267q30.857096-36.774055 67.631152-5.916959Z" fill="#D8D8D8" p-id="5497"></path><path d="M976.367427 381.384588m8.336002 47.275814l0 0q8.336002 47.275814-38.939813 55.611816l-157.559156 27.78193q-47.275814 8.336002-55.611816-38.939812l0 0q-8.336002-47.275814 38.939813-55.611816l157.559156-27.781931q47.275814-8.336002 55.611816 38.939813Z" fill="#CFCFCF" p-id="5498"></path><path d="M951.698612 710.431467m-24.00256 41.573653l0 0q-24.00256 41.573653-65.576214 17.571093l-138.555196-79.99488q-41.573653-24.00256-17.571094-65.576213l0 0q24.00256-41.573653 65.576214-17.571093l138.555196 79.99488q41.573653 24.00256 17.571094 65.576213Z" fill="#C1C1C1" p-id="5499"></path><path d="M721.25083 946.641422m-45.110057 16.418718l0 0q-45.110057 16.418718-61.528775-28.691339l-54.71972-150.341197q-16.418718-45.110057 28.691339-61.528775l0 0q45.110057-16.418718 61.528775 28.691339l54.71972 150.341197q16.418718 45.110057-28.691339 61.528775Z" fill="#ADADAD" p-id="5500"></path><path d="M392.950039 979.471853m-45.110057-16.418718l0 0q-45.110057-16.418718-28.691339-61.528775l54.71972-150.341196q16.418718-45.110057 61.528775-28.691339l0 0q45.110057 16.418718 28.691339 61.528775l-54.71972 150.341196q-16.418718 45.110057-61.528775 28.691339Z" fill="#878787" p-id="5501"></path><path d="M120.306508 793.578773m-24.00256-41.573653l0 0q-24.00256-41.573653 17.571094-65.576213l138.555196-79.99488q41.573653-24.00256 65.576214 17.571093l0 0q24.00256 41.573653-17.571094 65.576213l-138.555196 79.99488q-41.573653 24.00256-65.576214-17.571093Z" fill="#747474" p-id="5502"></path><path d="M30.964126 475.916048m8.336002-47.275815l0 0q8.336002-47.275814 55.611816-38.939812l157.559156 27.78193q47.275814 8.336002 38.939812 55.611816l0 0q-8.336002 47.275814-55.611816 38.939812l-157.559156-27.78193q-47.275814-8.336002-38.939812-55.611816Z" fill="#646464" p-id="5503"></path><path d="M166.686091 175.163728m36.774055-30.857097l0 0q36.774055-30.857096 67.631152 5.916959l102.839435 122.559267q30.857096 36.774055-5.916959 67.631152l0 0q-36.774055 30.857096-67.631152-5.916959l-102.839435-122.559267q-30.857096-36.774055 5.916959-67.631152Z" fill="#535353" p-id="5504"></path></svg>`
const ImageError = `<svg t="1693741357217" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14326" width="40" height="40"><path d="M512 768H128V576l192-192 192 192 128-128c68.288 48.448 110.912 69.76 128 64 46.656 0 90.368 12.48 128 34.24V192H64v640h448v-64z m448-169.344A256 256 0 1 1 546.24 896H0V128h960v470.656zM768 384a64 64 0 1 1 0-128 64 64 0 0 1 0 128z m0 576a192 192 0 1 0 0-384 192 192 0 0 0 0 384z m-32-288a32 32 0 1 1 64 0V768a32 32 0 1 1-64 0v-96zM768 896a32 32 0 1 1 0-64 32 32 0 0 1 0 64z" fill="#f83838" p-id="14327"></path></svg>`

function addUid(){
    return `${Math.random()*10}`.replace(".",'')
}

// const chacheImageMap = new Map()
const alLoad :any[]= [];

interface IImageProps {
    src:string,
    id?:string | number,
    delay?:number,
    successCallback?:(...args:any)=>void,
    getChacheImage?:(chacheId:string|number)=>HTMLImageElement|undefined
    [key:string]:any
}

const CustomImage :React.FC<IImageProps>= ({src="",id='',delay=300,successCallback,getChacheImage})=>{
    const divRef = useRef<HTMLDivElement>(null)

    useEffect(()=>{
        
        if(divRef.current){
            const ref = divRef.current;
            let chache = getChacheImage?.(id);
            if(chache){
                let old = ref.childNodes[0];
                if(old && old.nodeType){
                    ref.replaceChild(chache,old)
                }else{
                    ref.appendChild(chache)
                }
                return
            }
            ref.innerHTML=`<span class='image-loading'>${loadingStr}</span>`

            
            let timer =  setTimeout(()=>{
                alLoad.push({id,src})
                loadImage(src).then((res:any)=>{
                    // chacheImageMap.set(id,res)
                   
                    successCallback?.({id,image:res})
                    let old = ref.childNodes[0];
                    if(old && old.nodeType){
                        ref.replaceChild(res,old)
                    }else{
                        ref.appendChild(res)
                    }
                }).catch(()=>{
                    ref.innerHTML = `<span class='image-error'>${ImageError}</span>`
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
    return <div className={`list-item ${props.ativeIndex===props.index?"is-active":""}`} 
    onClick={()=>props.onSelect(props.index)}>
        <CustomImage 
        {...props}
        src={props.carImg} 
        id={props.key}
        />
    <div className="item-index">{props.index}</div></div>
}

const App = ()=>{
    const listRef = useRef<IVirtualListForward>(null)
    const page = useRef(0)
    const [index,setIndex] = useState<number>(0);
    const  chacheImageMap = useRef(new Map())
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


    
    const onGetChacheImage = useCallback(()=>{
        console.log("chache:",chacheImageMap.current)
        console.log("alLoad:",alLoad)
        console.log("data:",data.length)
    },[])

    const onClearChacheImage = useCallback(()=>{
        chacheImageMap.current?.clear();
    },[])

    const successCallback = useCallback(({id,image})=>{
        const chache = chacheImageMap.current;
        if(chache && image && id){
            chache.set(id,image)
        }
    },[])
    const getChacheImage =useCallback((id)=>{
        const chache = chacheImageMap.current;
        return chache && chache.get(id)
    },[chacheImageMap])

    return <div className="test2-warp">
         <Button onClick={()=>onClickPage("-")}>上一页</Button>
         <Button onClick={()=>onClickPage("+")}>下一页</Button>
         <Button onClick={()=>onClickIndex("-")}>上一张</Button>
         <Button onClick={()=>onClickIndex("+")}>下一张</Button>
         <Button onClick={onGetChacheImage}>获取缓存图片</Button>
         <Button onClick={onClearChacheImage}>清除缓存图片</Button>

        <div>当前第几张：{index}</div>
        {/* successCallback?:(...args:any)=>void,
    getChacheImage? */}

        <VirtualList ref={listRef} data={data} rowKey="key" itemSize={150} renderItem={(itemProps)=>RenderItme({...itemProps,ativeIndex:index,onSelect:onSelect,successCallback,getChacheImage}) } layout={"horizontal"} totals={data.length}/>
    </div>
}

export default App

