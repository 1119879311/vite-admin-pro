import React, { useState } from "react";
import { Table, Tab, Overlay, Icon, NumberPicker } from "@alifd/next";
import { tabsList, mainColums, tablesMapColums } from "./config";
// import SettingColumns from "./SettingColumns";
import CutomTable from "./CutomTable";

const { Popup } = Overlay;
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

export default React.memo(() => {
  const [tabkey, setTabKey] = useState(tabsList[0].key);

  // 切换tab
  const onTabChange = (key) => {
    setTabKey(key);
  };
  const rowProps = (rowData, index) => {
    console.log("rowData", rowData, index);
    return {
      style: {
        backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
      },
    };
  };

  const cellProps = (rowIndex, colIndex, dataIndex, record) => {
    // console.log("cellProps", rowIndex, colIndex, dataIndex, record);
  };

  const AdjustvalueCell = (data) => {
    return (
      <div>
        <NumberPicker />
      </div>
    );
  };
  const cellRenderMap = {
    "W+1Adjustvalue": AdjustvalueCell,
    "W+2Adjustvalue": AdjustvalueCell,
  };

  return (
    <div>
      <CutomTable
        dataSource={dataSource()}
        columns={mainColums}
        crossline
        fixedHeader
      />

      <Tab
        activeKey={tabkey}
        onChange={onTabChange}
        style={{ position: "relative" }}
      >
        {tabsList.map((item) => (
          <Tab.Item title={item.label} key={item.key}>
            <CutomTable
              crossline
              fixedHeader
              rowProps={rowProps}
              cellProps={cellProps}
              dataSource={dataSource()}
              columns={tablesMapColums[item.key]}
              cellRenderMap={cellRenderMap}
            />
          </Tab.Item>
        ))}
      </Tab>
    </div>
  );
});
