import React from "react";
import { RouteObject } from "react-router-dom";

export const getView = (path: string) => {
  return React.lazy(() => import(/* @vite-ignore */ `../../${path}`));
};

export interface IGenerateRoutes extends RouteObject {
  filePath: string;
  children?: IGenerateRoutes[];
}

/**
 * 根据组件路径生成路由
 * @param IRouterConfig
 * @returns
 */
export function generateRoutes(
  IRouterConfig: IGenerateRoutes[] = []
): RouteObject[] {
  return IRouterConfig.map((item) => {
    const { filePath, children, ...itemRoute } = item;

    if (!itemRoute.element) {
      let RouerCompoent = getView(filePath);
      itemRoute.element = <RouerCompoent />;
    }
    if (item.children) {
      item.children = generateRoutes(children) as any;
    }
    return itemRoute;
  });
}
