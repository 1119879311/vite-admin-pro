import React from "react";
import { Table } from "@alifd/next";
const dataSource = () => {
  const result: any[] = [];
  for (let i = 0; i < 5; i++) {
    result.push({
      title: {
        name: `Quotation for 1PCS Nano ${3 + i}.0 controller compatible`,
      },
      id: "id" + i,
      time: 2e3 + i,
    });
  }
  return result;
};
const render = (value, index, record) => {
  return (
    <a href="javascript:;">
      {"Remove("}
      {record.id}
      {")"}
    </a>
  );
};
const columns = [
  {
    title: "id-1",
    dataIndex: "id",
    width: 140,
  },
  {
    title: "Group2-7",
    children: [
      {
        title: "id-2",
        dataIndex: "id",
        width: 140,
      },
      {
        title: "title-1(固定)",
        dataIndex: "title.name",
        lock: true,
        width: 200,
      },
      {
        title: "Group4-7",
        children: [
          {
            title: "Title4",
            dataIndex: "title.name",
            width: 400,
          },
          {
            title: "Title5",
            dataIndex: "title.name",
            width: 200,
          },
          {
            title: "tet",
            children: [
              {
                title: "Title6",
                dataIndex: "title.name",
                width: 400,
              },
              {
                title: "Title7",
                dataIndex: "title.name",
                width: 200,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "",
    children: [
      {
        title: "Time",
        dataIndex: "time",
        width: 500,
      },
      {
        cell: render,
        width: 200,
      },
    ],
  },
];

console.log("columns", columns);
export default React.memo(() => {
  return (
    <div>
      <Table dataSource={dataSource()} columns={columns} />
    </div>
  );
});
