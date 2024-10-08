import React, { useState } from "react";
import { Table, Tab, Overlay, Icon, Pagination, Box } from "@alifd/next";

import SettingColumns from "./SettingColumns";

// 渲染单元格
const renderTableColumn: any = (clunms = [], { cellRenderMap }) => {
  return clunms.map((item) => {
    if (item.children?.length) {
      return (
        <Table.ColumnGroup
          title={item.title}
          key={item.dataIndex}
          align={item.align}
        >
          {renderTableColumn(item.children, { cellRenderMap })}
        </Table.ColumnGroup>
      );
    }
    return (
      <Table.Column
        title={item.title}
        key={item.dataIndex}
        dataIndex={item.dataIndex}
        width={item.width || 120}
        align={item.align}
        lock={item.lock}
        cell={
          cellRenderMap[item.dataIndex]
            ? (value, index, record) =>
                cellRenderMap[item.dataIndex]({ value, index, record, item })
            : undefined
        }
      />
    );
  });
};

const CustomTable: any = ({
  isSetting = true,
  extra,
  columns = [],
  isPage = true,
  cellRenderMap = {},
  ...tablePorps
}) => {
  const [inintAllColumns] = useState(
    isSetting ? JSON.parse(JSON.stringify(columns)) : []
  );

  const [pagerConf, setPageConf] = useState({
    total: 0,
    pageNo: 1,
    pageSize: 10,
  });

  const [renderColumns, setColumns] = useState(columns);

  const onPageChange = (params) => {
    setPageConf({ ...pagerConf, ...params });
  };

  return (
    <div className="Custom-table">
      {isSetting || extra ? (
        <div
          className="custom-table-extra"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          {extra ? (
            extra(
              isSetting ? (
                <SettingColumns list={inintAllColumns} onUpdate={setColumns} />
              ) : null
            )
          ) : (
            <SettingColumns list={inintAllColumns} onUpdate={setColumns} />
          )}
        </div>
      ) : null}
      <Table.StickyLock crossline fixedHeader {...tablePorps}>
        {renderTableColumn(renderColumns, { cellRenderMap })}
      </Table.StickyLock>
      <div
        className="custom-table-pagination"
        style={{ display: "flex", justifyContent: "flex-end", margin: "20px" }}
      >
        <Pagination
          defaultCurrent={1}
          pageSize={pagerConf.pageSize}
          pageSizeSelector="filter"
          pageSizePosition="start"
          pageSizeList={[10, 20, 50]}
          current={pagerConf.pageNo}
          onPageSizeChange={(pageSize) => onPageChange({ pageSize })}
          onChange={(pageNo) => onPageChange({ pageNo })}
          total={pagerConf?.total || 0}
          totalRender={(total) => `共 ${total} 条`}
        />
      </div>
    </div>
  );
};

export default React.memo(CustomTable);
