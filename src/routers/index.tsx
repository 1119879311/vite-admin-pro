import React, { Suspense, useEffect, useState } from "react";
import {
  useRoutes,
  BrowserRouter,
  HashRouter,
} from "react-router-dom";

import Login from "@/view/login";
import Layout from "@/components/layout/index";
import Nofount from "@/view/NoFount/404";
import { dynamicsRoutes } from "./data/routes";


function LoadRoutes() {
  let [addRoutes, setAddRoutes] = useState<any[]>([]);
  useEffect(() => {
    let timer = setTimeout(() => {
      setAddRoutes(dynamicsRoutes);
    });
    return () => {
      clearInterval(timer);
    };
  }, []);
  return useRoutes([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/404",
      element: <Nofount />,
    },
    {
      path: "/admin",
      element: <Layout />,
      children: [
        ...addRoutes,
        {
          path: "*",
          element: <Nofount />,
        },
      ],
    },
    {
      path: "*",
      element: <Nofount />,
    },
  ]);
}

export default () => {
  return (
    <BrowserRouter>
      <LoadRoutes></LoadRoutes>
    </BrowserRouter>
  );
};
