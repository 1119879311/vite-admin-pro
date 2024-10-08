import { Navigate } from "react-router-dom";
import BasicLayout from "@/layout";
import NotFount from "@/view/NotFount";
import Login from "@/view/Login";
import ReduxTest from "@/view/TestDome/ReduxTest";
import FabricTest from "@/view/TestDome/FabricTest";
import VirtualList from "@/view/TestDome/VirtualList";
import LayoutTest from "@/view/TestDome/Layout";
import EditTable from "@/view/TestDome/EditTable";
import Drag from "@/view/TestDome/Drag";
import Flex from "@/view/TestDome/Flex";
import FusionTable from "@/view/TestDome/FusionLib/Table";



export const initRoutes = (addRoutes: any[] = []) => [
  {
    path: "/",
    element: <Navigate to="/admin" />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/404",
    element: <NotFount />,
  },
  {
    path: "/admin",
    element: <BasicLayout />,
    children: [
      ...addRoutes,
      {
        path: "*",
        element: <NotFount />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFount />,
  },
];

export const dynamicsRoutes = [
  {
    path: "/admin/redux",
    element: <ReduxTest />,
  },
  {
    path: "/admin/fabric",
    element: <FabricTest />,
  },
  {
    path: "/admin/virtualList",
    element: <VirtualList />,
  },
  {
    path: "/admin/layoutTest",
    element: <LayoutTest />,
  },
  {
    path: "/admin/editTable",
    element: <EditTable />,
  },
  {
    path: "/admin/drag",
    element: <Drag />,
  },
  {
    path: "/admin/flex",
    element: <Flex />,
  },
  {
    path: "/admin/fusion/table",
    element: <FusionTable />,
  },
];
