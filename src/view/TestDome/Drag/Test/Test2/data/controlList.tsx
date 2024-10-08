export default [
  {
    id: "1",
    title: "通用组件",
    type: "base",
    children: [
      {
        id: "1-1",
        type: "String",
        title: "字符串1",
        defaultValue: undefined,
      },
      {
        id: "1-2",
        type: "Container",
        title: "容器",
        defaultValue: { children: [] },
      },
    ],
  },
  {
    id: "2",
    title: "表单组件",
    type: "base",
    children: [
      {
        id: "2-1",
        type: "String",
        title: "字符串",
        defaultValue: undefined,
      },
    ],
  },
];
