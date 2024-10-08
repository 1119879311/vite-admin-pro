import { IGenerateRoutes, generateRoutes } from "../utils/index";
import FusionTable from "@/view/TestDome/FusionLib/Table";

const dynamicsRoutesConf: IGenerateRoutes[] = [
  {
    path: "/admin",
    filePath: "view/Index",
  },

  {
    path: "/admin/redux",
    filePath: "view/TestDome/ReduxTest",
  },
  {
    path: "/admin/fabric",
    filePath: "view/TestDome/FabricTest",
  },
  {
    path: "/admin/virtualList",
    filePath: "view/TestDome/VirtualList",
  },
  {
    path: "/admin/layoutTest",
    filePath: "view/TestDome/Layout",
  },
  {
    path: "/admin/editTable",
    filePath: "view/TestDome/EditTable",
  },
  {
    path: "/admin/drag",
    filePath: "view/TestDome/Drag",
  },
  {
    path: "/admin/flex",
    filePath: "view/TestDome/Flex",
  },
  {
    path: "/admin/fusion/table",
    filePath: "view/TestDome/FusionLib/Table",
    component: FusionTable,
  },
  {
    path: "/admin/role",
    filePath: "view/role",
  },
  {
    path: "/admin/user",
    filePath: "view/user",
  },
];

export const dynamicsRoutes = generateRoutes(dynamicsRoutesConf);
