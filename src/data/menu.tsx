const menuData = [
  { key: "1", label: "首页", url: "/admin", iconName: "default" },
  {
    key: "2",
    label: "测试dome",
    url: "/admin/dome",
    iconName: "default",
    children: [
      {
        key: "2-1",
        label: "redux-示例",
        url: "/admin/redux",
        iconName: "default",
      },
      {
        key: "2-2",
        label: "fabric-示例",
        url: "/admin/fabric",
        iconName: "default",
      },
      {
        key: "2-3",
        label: "virtualList -示例",
        url: "/admin/virtualList",
        iconName: "default",
      },
      {
        key: "2-4",
        label: "layout-示例",
        url: "/admin/layoutTest",
        iconName: "default",
      },
      {
        key: "2-5",
        label: "编辑表格-示例",
        url: "/admin/editTable",
        iconName: "default",
      },
      {
        key: "2-6",
        label: "拖拽-示例",
        url: "/admin/drag",
        iconName: "default",
      },
      {
        key: "2-7",
        label: "Flex-示例",
        url: "/admin/flex",
        iconName: "default",
      },

      {
        key: "2-8",
        label: "fusion-design-示例",
        url: "/admin/fusion",
        iconName: "default",
        children: [
          {
            key: "2-8-1",
            label: "fusion-table-示例",
            url: "/admin/fusion/table",
            iconName: "default",
          },
        ],
      },
    ],
  },
  {
    key: "3",
    label: "User",
    url: "/admin/user",
    iconName: "default",
    children: [
      {
        key: "3-1",
        label: "Bill",
        url: "/admin/4",
        iconName: "default",
      },
      {
        key: "3-2",
        label: "Alex",
        url: "/admin/5",
        iconName: "default",

        children: [
          {
            key: "3-2-1",
            label: "Alex-1",
            url: "/admin/5/1",
            iconName: "default",
          },
        ],
      },
    ],
  },
];

export default menuData;
