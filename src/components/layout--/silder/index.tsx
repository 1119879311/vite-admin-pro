import React, { useEffect, useMemo, useRef, useState } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import menuData from "@/data/menu";
type MenuItem = Required<MenuProps>["items"][number];

const iconMap: Record<string, React.ReactNode> = {
  default: <AppstoreOutlined />,
  user: <UserOutlined />,
};

type IMenuItemProps = MenuItem & {
  url?: string;
  iconName?: string;
  children?: IMenuItemProps[];
};

function transformMenu(
  data: Array<IMenuItemProps> = [],
  pid: string | number | undefined,
  flatMenu: Record<React.Key, {}> = {}
): MenuItem[] {
  if (!Array.isArray(data) || !data.length) {
    return undefined as any;
  }
  return data.map((item) => {
    let { children, iconName = "", ...props } = item;
    let result = { ...props, icon: iconMap[iconName] } as any;
    if (props.key !== undefined) {
      flatMenu[props.key] = { ...props, pid };
    } else if (props.url) {
      flatMenu[props.url] = { ...props, pid };
    }
    result.children = transformMenu(children, props.key, flatMenu);
    return result;
  });
}

/**
 * 获取所有父级的key
 * @param key
 * @param flatMenu
 * @returns
 */
function getAllParentKey(key: string, flatMenu: Record<React.Key, any> = {}) {
  let target = flatMenu[key];
  let result: string[] = [];
  while (target) {
    let pid = target.pid;
    result.push(pid);
    target = flatMenu[pid];
  }
  return result;
}

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flatMenu = useRef({});
  const [items, setItem] = useState<MenuItem[]>([]);
  const [defaultOpenKeys, setDefaultOpenKeys] = useState<string[]>([]);
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState<string[]>([]);
  useEffect(() => {
    let result = transformMenu(menuData, "0", flatMenu.current);

    // 找出当前url 匹配的菜单
    let targetMenu: any = Object.values(flatMenu.current).find(
      (item: any) => item.url === location.pathname
    );
    if (targetMenu) {
      // 设置当前默认选中的
      setDefaultSelectedKeys([targetMenu.key]);
      // // 设置当前默认打开的
      setDefaultOpenKeys(getAllParentKey(targetMenu.key, flatMenu.current));
    }

    setItem(result);
  }, []);

  if (!items.length) {
    return null;
  }
  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultOpenKeys={defaultOpenKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      items={items}
      onSelect={(item: MenuItem) => {
        console.log(item);
        item?.key && navigate(flatMenu.current[item.key].url);
      }}
    />
  );
};
export default React.memo(App);
