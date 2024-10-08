// export const menuData:Array<any> = [
//     {
//         label:"首页",
//         path:'/admin'
//     },
//     {
//         label:"rgba管理",
//         children:[
//             {
//                 label:"用户管理",
//                 path:'/admin/manager'
//             },
//             {
//                 label:"角色管理",
//                 path:'/admin/role'
//             },
//             {
//                 label:"资源管理",
//                 path:'/admin/resource'
//             },
//         ]
//     },
//     {
//         label:"客户管理",
//         children:[
//             {
//                 label:"客户列表",
//                 path:'/admin/customer'
//             },
   
//         ]
//     },
//     {
//         label:"订单管理",
//         children:[
//             {
//                 label:"订单列表",
//                 path:'/admin/order'
//             },
   
//         ]
//     },
//     {
//         label:"日志管理",
//         children:[
//             {
//                 label:"登录日志",
//                 path:'/admin/login-log'
//             },
//             {
//                 label:"充值日志",
//                 path:'/admin/recharge-log'
//             },
           
//         ]
//     },
//   ]


export const menuData = [
    { key: "1", label: "首页", path: "/admin"  },
    {
      key: "2",
      label: "测试dome",
      path: "/admin/dome",
      
      children: [
        {
          key: "2-1",
          label: "redux-示例",
          path: "/admin/redux",
          
        },
        {
          key: "2-2",
          label: "fabric-示例",
          path: "/admin/fabric",
          
        },
        {
          key: "2-3",
          label: "virtualList -示例",
          path: "/admin/virtualList",
          
        },
        {
          key: "2-4",
          label: "layout-示例",
          path: "/admin/layoutTest",
          
        },
        {
          key: "2-5",
          label: "编辑表格-示例",
          path: "/admin/editTable",
          
        },
        {
          key: "2-6",
          label: "拖拽-示例",
          path: "/admin/drag",
          
        },
        {
          key: "2-7",
          label: "Flex-示例",
          path: "/admin/flex",
          
        },
  
        {
          key: "2-8",
          label: "fusion-design-示例",
          path: "/admin/fusion",
          
          children: [
            {
              key: "2-8-1",
              label: "fusion-table-示例",
              path: "/admin/fusion/table",
              
            },
          ],
        },
      ],
    },
    {
      key: "3",
      label: "User",
      path: "/admin/user",
      
      children: [
        {
          key: "3-1",
          label: "Bill",
          path: "/admin/4",
          
        },
        {
          key: "3-2",
          label: "Alex",
          path: "/admin/5",
          
  
          children: [
            {
              key: "3-2-1",
              label: "Alex-1",
              path: "/admin/5/1",
              
            },
          ],
        },
      ],
    },
  ];
