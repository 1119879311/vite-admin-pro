import { Button, Drawer, Form, Input, InputProps, Space, Switch } from "antd";
import { forwardRef } from "react";
import { useEffect } from "react";
import { useRef, useState } from "react";
import CtrEditTable from "@/components/EditTable";

export default () => {
  const [form] = Form.useForm();
  const tableRef = useRef();
  const inpuptRef = useRef<null>();

  const selectedRowKeysRef = useRef<any[]>([]);
  const onValuesChange = (...values) => {
    console.log("onValuesChange", values);
  };
  const getVery = () => {
    form.validateFields().then((res) => {
      console.log("validateFields", res);
    });
  };
  const setData = () => {
    form.setFieldsValue({
      fields: [
        {
          id: 1,
          name: "test1",
          isVisual: true,
          paramConfig: JSON.stringify({ id: 1, nodeName: 2 }),
        },
        {
          id: 2,
          name: "test2",
          isVisual: false,
          paramConfig: JSON.stringify({ id: 1, nodeName: 2 }),
        },
      ],
    });
  };
  const getData = () => {
    console.log("getData", inpuptRef, form.getFieldsValue());
  };
  return (
    <Form
      form={form}
      initialValues={{
        fields: [
          {
            id: 0,
            name: "test0",
            isVisual: true,
            paramConfig: JSON.stringify({ id: 0, nodeName: 2 }),
          },
        ],
      }}
      onValuesChange={onValuesChange}
    >
      <Button type="primary" onClick={getData}>
        获取
      </Button>
      <Button type="primary" onClick={getVery}>
        校验
      </Button>
      <Button type="primary" onClick={setData}>
        设置
      </Button>
      <Button type="primary" onClick={() => form.resetFields()}>
        重置
      </Button>
      <Form.Item name="fields">
        <CtrEditTable
          ref={tableRef}
          rowKey="id"
          className="ctr-contolinfo"
          rowSelection={{
            type: "checkbox",
            onChange: (selectedRowKeys, selectedRows) => {
              selectedRowKeysRef.current = selectedRowKeys;
            },
          }}
          columns={[
            {
              title: "控件",
              dataIndex: "name",
              editable: true,
              width: "40%",
              editProps: {
                inputType: "input",
                shouldUpdate: (prevValues, curValues) =>
                  prevValues.isVisual !== curValues.isVisual,
                inputParam: {},
                mutex: (form, props) => {
                  //console.log("mutex",form,form.getFieldValue([props.rowIndex,'isVisual']) )
                  let res = form.getFieldValue([props.rowindex, "isVisual"]);
                  console.log("res", res);
                  // return res;
                  // return { inputParam: { disabled: !res } };
                  return res
                    ? { formItemParam: { rules: [{ required: true }] } }
                    : { formItemParam: { rules: [{ required: false }] } };
                },
              },
              // defaultValue:<div>1212</div>,
            },
            {
              title: "是否可视化",
              dataIndex: "isVisual",
              width: "35%",
              editable: true,
              editProps: {
                inputType: "switch",
                inputParam: {},
                formItemParam: { valuePropName: "checked", initialValue: true },
              },
            },
            // {
            // title: '类型',
            // dataIndex: 'paramConfig',
            // editable: true,
            // width: '20%',
            // editProps:{
            //     inputType:"btnDrawer", // 这个当前编辑下对应要渲染的组件
            //     formItemParam:{initialValue:JSON.stringify({id:111})},
            //     btnParam:({value,record,...val})=>{
            //       // console.log("val",record,val)
            //         return ({children:record.name,block:false,disabled:record.isVisual,type:"primary"})
            //     }

            //     }
            // },
            {
              title: "操作",
              render: (value, recored, index) => {
                //   console.log("action", value,recored,index)
                return (
                  <div>
                    <Button
                      onClick={() => {
                        // console.log("tableRef",tableRef.current,selectedRowKeysRef.current)
                        // tableRef.current.onDeleteIndex(index)
                        // tableRef.current.onDelete(selectedRowKeysRef.current)
                      }}
                    >
                      删除
                    </Button>
                  </div>
                );
              },
            },
          ]}
        ></CtrEditTable>
      </Form.Item>
    </Form>
  );
};
