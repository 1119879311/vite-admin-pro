/**
 * 编辑表格
 */
import { Form, FormInstance, Table, TableProps } from "antd";
import React, { ReactNode, useEffect, memo } from "react";
import { getPaths } from "./util";

import { set, get } from "lodash";
import CtrRenderFormItem, { IWidgetProps } from "./FormItem";
const EditableContext = React.createContext<FormInstance | null>(null);
type EditableTableProps = Parameters<typeof Table>[0];
type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const EditableRow: (props: Record<string, any>) => ReactNode = memo(
  ({ index, rowid, ...props }) => {
    return <tr {...props} />;
  }
);

const EditableCell = memo((props: Record<string, any>) => {
  const { name, col, record, rowkey, rowindex, children, ...restProps } = props;
  let childNode;
  if (col && col.editable) {
    let param = { ...(col.editProps || {}), record, rowkey, rowindex, name };
    childNode = <CtrRenderFormItem {...param} />;
  } else {
    childNode = children;
  }

  return <td {...restProps}>{childNode}</td>;
});

interface ITableProps extends TableProps<any> {
  columns: (ColumnTypes[number] & {
    editable?: boolean;
    editProps?: IWidgetProps;
    dataIndex?: string;
  })[];
  rowKey: string;
  onFormChange?: <T>(
    data: T[],
    value?: any,
    path?: string,
    type?: string
  ) => void;
  header?: () => ReactNode;
  footer?: () => ReactNode;
  [key: string]: any;
}

const EditTable: React.FC<ITableProps> = memo((props) => {
  const {
    rowKey = "key",
    columns = [],
    value = [],
    header,
    footer,
    ...tableProps
  } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(props.value);
  }, [props.value]);

  // 保存
  const onValuesChange = (values: Record<string, any>) => {
    let paths = getPaths(values)[0]?.join(".");
    if (paths) {
      let newVaue = get(values, paths);
      let data = props.value;
      set(data, paths, newVaue);
      props.onFormChange?.(data, values, paths, "valueChange");
    }
  };

  const components: any = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const resColumns: any[] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any, rowIndex: any) => ({
        name: [rowIndex, col.dataIndex],
        rowkey: rowKey,
        record, // 行数据
        rowindex: rowIndex, // 行索引
        col,
      }),
    };
  });

  return (
    <div className="ctr-editTable-warp">
      {header && <div className="ctr-editTable-header">{header?.()}</div>}
      <Form form={form} component={false} onValuesChange={onValuesChange}>
        <EditableContext.Provider value={form}>
          <Table
            onRow={(record, index) => ({
              index,
              rowid: record[rowKey],
              ...record,
            })}
            components={components}
            rowKey={rowKey}
            dataSource={value}
            columns={resColumns}
            pagination={false}
            {...tableProps}
          />
        </EditableContext.Provider>
      </Form>
      {footer && <div className="ctr-editTable-footer">{footer?.()}</div>}
    </div>
  );
});

export default EditTable;
