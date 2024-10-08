import React, { useEffect, useMemo, useRef, useState } from "react"
import {Menu} from "antd"
import {  AppstoreOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isNotEmpty } from "@/utils/heper";
import ByHideScrollbar from "../ByHidescrollbar"
const { SubMenu } = Menu;
interface ILayoutSilder {
   
    data?:any[],
   
}

const menuItme = (itmeData:any[])=>{
    return itmeData.map(itmes=>{
      if(itmes.children&&itmes.children.length){
      return <SubMenu
         key={itmes.key}
         title={
           <span>
             <AppstoreOutlined />
             <span>{itmes.title}</span>
           </span>
         }>
         {menuItme(itmes.children)}
     </SubMenu>
      
      }else{
        
       return (
         <Menu.Item key={itmes.key}>
          <Link to={itmes.url}>
              <AppstoreOutlined />
              <span> {itmes.title}</span>
            </Link>
          </Menu.Item>
        )
      }
     
    })
 
}

const tranformData = (data:any[], mapData:Record<string,any[]>={}, keys:any[] = [],pid:any=null)=>{
    // const result:{ flatData:any[],treeData:any[]} = { flatData:[],treeData:[] }
    let flatData:any[] = [];
    const treeData:any[] = [];
    data.forEach((item,index)=>{
        const {children,key,...itmeProps} = item;
        const newKey = isNotEmpty(key)? key: (isNotEmpty(pid) ? `${pid}-${index}`:`${index}`);
        const newKeys = [...keys,newKey]
        const newItme = {
            ...itmeProps,
            key:newKey,
            keys:newKeys
        };
        flatData.push({...newItme});
        if(Array.isArray(children) && children.length){
            const resChild = tranformData(children,mapData,newKeys,newKey);
            newItme.children = resChild.flatData;
            flatData = flatData.concat(resChild.flatData)
        }else{
            // 只有最底层才有跳转
            mapData[newItme.path] = mapData[newItme.path] || []
            mapData[newItme.path].push({...newItme})
        }
        treeData.push(newItme)

    })

    return {treeData,flatData,mapData}

}

const LayoutSilder:React.FC<ILayoutSilder> = ({data=[]})=>{
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedKeys,setSelectedKeys] = useState<string[]>([])
  const [openKeys,setOpenKeys] = useState<string[]>([]);
  const chachePath = useRef<string>('')

  const {treeData,mapData} = useMemo(()=>tranformData(data),[data]);
  useEffect(()=>{
    // console.log('--location-',location,mapData)
    const list = mapData[location.pathname];
    if(!list || chachePath.current===location.pathname){
      return
    }
    let newSelectKeys:string[] = []
    let newOpenKeys:string[] = [];
    list.forEach(item=>{
      console.log("item.keys",item.keys,item.keys.slice(0, item.keys.length-1))
      newOpenKeys = newOpenKeys.concat(item.keys.slice(0, item.keys.length-1));
      newSelectKeys.push(item.key)

    })
    setOpenKeys((prev)=>([...new Set([...prev,...newOpenKeys])]))
    setSelectedKeys(newSelectKeys)
  },[location,mapData])
   
    return   <ByHideScrollbar y={true}> <Menu
    theme="dark"
    mode="inline"
    selectedKeys={selectedKeys}
    openKeys={openKeys}
   
    items={treeData}
    onOpenChange={(openKey)=>{
      setOpenKeys(openKey)
    }}
    onSelect={(e:any) => {
      setSelectedKeys(e.key)
      const path = e.item?.props?.path
      path && navigate(path);
      chachePath.current = path
    }}
  /></ByHideScrollbar>
   
}

export default React.memo(LayoutSilder)