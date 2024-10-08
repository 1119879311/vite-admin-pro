// 请注意，这个例子仅为展示如何集成 react-sortablejs，实际运行时可能需要进一步的适配和调试。

import { TableColumns, TableDataSource } from "./data";
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import Sortable from "sortablejs";
import "./index.less";

const initialColumns = [
  {
    title: "Drag",
    dataIndex: "drag",
    width: 50,
    className: "drag-visible",
    render: () => (
      <span className="drag-handle" style={{ cursor: "grab" }}>
        |||
      </span>
    ),
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
    key: "address",
  },
];

const initialData = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
];

const DraggableTable = () => {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const el = document.querySelector(".ant-table-tbody");
    let sortableInstance = Sortable.create(el, {
      animation: 150,
      handle: ".drag-handle",
      chosenClass: "draggable-highlight", // 拖拽时高亮的CSS类
      dragClass: "sortable-drag", // 正在被拖拽中的css类名
      //   forceFallback: true, // 启用回退，以应对某些情况下光标不变的问题
      fallbackClass: "ant-table-row-dragging", // 拖动时应用于镜像的类名
      //   onStart: () => {
      //     document.body.style.cursor = "grabbing"; // 拖拽开始时，整个页面的光标变化
      //   },
      onEnd: ({ newIndex, oldIndex }) => {
        // document.body.style.cursor = ""; // 拖拽结束后，恢复默认光标
        console.log("--onEnd----", newIndex, oldIndex);
        if (newIndex === oldIndex) {
          return;
        }
        // sortableInstance.cancel(); // 使用正确的方法取消拖拽动作
        // const newData = [...data];
        // newData.splice(newIndex, 0, newData.splice(oldIndex, 1)[0]);
        setData([...data]);
      },
    });
  }, [data]);
  console.log("newData", data);
  const onRow = (record, rowIndex) => {
    return {
      className: "draggable-row", // 添加行为类，用于CSS选择器
      "data-row-key": record.key,
    };
  };
  return (
    <Table
      //   onRow={onRow}
      columns={initialColumns}
      dataSource={data}
      pagination={false}
    />
  );
};

export default DraggableTable;

// function SortableTable({}) {
//   const [data, setData] = useState(TableDataSource);

//   const columns = [
//     {
//       title: "Drag",
//       dataIndex: "drag",
//       width: 50,
//       className: "drag-visible",
//       render: () => (
//         <span className="drag-handle" style={{ cursor: "grab" }}>
//           |||
//         </span>
//       ),
//     },
//     ...TableColumns,
//   ];

//   // 自定义行组件
//   const DraggableBodyRow = ({ index, ...restProps }) => {
//     // 只需将其他属性传递给原生tr即可
//     return <tr {...restProps} />;
//   };

//   return (
//     <ReactSortable
//       list={data}
//       setList={setData}
//       handle=".drag-handle"
//       tag="tbody"
//     >
//       <Table
//         columns={columns}
//         dataSource={data}
//         components={{
//           body: {
//             row: DraggableBodyRow,
//           },
//         }}
//         rowKey="id"
//         pagination={false}
//         onRow={(record, index) => ({
//           index, // ReactSortable 需要index属性来识别每一行
//           "data-rank": index, // 自定义属性，将索引传递给排序的行
//         })}
//       />
//     </ReactSortable>
//   );
// }

// export default SortableTable;
