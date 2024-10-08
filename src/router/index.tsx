import { useState, useEffect } from "react";
import { useRoutes, HashRouter } from "react-router-dom";
import { initRoutes, dynamicsRoutes } from "./data";
function LoadRoutes() {
  let [addRoutes, setAddRoutes] = useState<any[]>(initRoutes(dynamicsRoutes));
  // useEffect(() => {
  //   let timer = setTimeout(() => {
  //     setAddRoutes(initRoutes(dynamicsRoutes));
  //   }, 3000);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []);

  return useRoutes(addRoutes);
}

export default () => (
  <HashRouter>
    <LoadRoutes></LoadRoutes>
  </HashRouter>
);
