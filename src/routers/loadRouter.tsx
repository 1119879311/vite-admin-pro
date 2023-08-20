import { RouteProps, Routes, Route, PathRouteProps } from "react-router-dom";
import React from "react";
type IrouterProps = RouteProps &
  PathRouteProps & {
    name?: string;
    title?: string;
    Component: any;
    routes?: IrouterProps[];
  };

const getView = (path: string) => {
  return React.lazy(() => import(`../${path}`));
};

const routerList: IrouterProps[] = [
  {
    Component: getView("view/login/"),
    path: "/login",
  },
  {
    Component: getView("view/layout/"),
    path: "/layout",
    routes: [],
  },
];

export function loadRouter(data: IrouterProps[]) {
  if (!Array.isArray(data) || !data.length) return null;
  return (
    <Routes>
      {data.map((item) => {
        let { routes = [], Component, ...props } = item;
        return (
          <Route {...props}>
            <Component>{loadRouter(routes)}</Component>
          </Route>
        );
      })}
    </Routes>
  );
}
