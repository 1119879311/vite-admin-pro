import type { MenuProps } from "antd";
type MenuItem = Required<MenuProps>["items"][number];

export type IMenuItemProps = MenuItem & {
  url?:string,
  iconName?:string,
  children?:IMenuItemProps[]
}

export const menuData:Array<IMenuItemProps> = [
  {key:"1",label:"首页",url:'/admin',iconName:"default" },
  {key:"2",label:"测试dome",url:'/admin/dome',iconName:"default" ,children:[
    {
      key:"2-1",label:"redux-示例",url:'/admin/redux',iconName:"default",
     },
     {
      key:"2-2",label:"fabric-示例",url:'/admin/fabric',iconName:"default",
     },
     {
      key:"2-3",label:"virtualList -示例",url:'/admin/virtualList',iconName:"default",
     },
     {
      key:"2-4",label:"canvas -示例",url:'/admin/canvas',iconName:"default",
     },
  ]},
   {
    key:"3",label:"User",url:'/admin/user',iconName:"default",children:[

      { 
        key:"3-1",label:"Bill",url:'/admin/4',iconName:"default",
       
      },
      {
        key:"3-2",label:"Alex",url:'/admin/5',iconName:"default",
        
        children:[
          {
            key:"3-2-1",label:"Alex-1",url:'/admin/5/1',iconName:"default",

          }
        ]
      }
    ]
   }
]
