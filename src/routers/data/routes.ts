import {IGenerateRoutes,generateRoutes} from "../utils/index"

const dynamicsRoutesConf:IGenerateRoutes[] =  [
  
      {
        path: "/admin",
        filePath:"view/Index",
      },
      
      {
        path: "/admin/reatRedux",
        filePath:"view/TestDome/ReduxTest",
      },
      {
        path:"/admin/useReduxUseContext",
        filePath:"view/TestDome/useReducerUseContext"
      },

      {
        path: "/admin/fabric",
        filePath:"view/TestDome/FabricTest",
      },
      {
        path: "/admin/virtualList",
        filePath:"view/TestDome/VirtualList",
      },
      {
        path: "/admin/canvas",
        filePath:"view/TestDome/Canvas",
      },
      {
        path: "/admin/role",
        filePath:"view/role",
       
      },
      {
        path: "/admin/user",
        filePath:"view/user",
       
      }
]


export const dynamicsRoutes = generateRoutes(dynamicsRoutesConf)

