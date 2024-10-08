import React, { ReactNode, memo } from "react";
import ControlList, { IWidgetListProps, IwidgetType } from "./ControlList";
import { Form, FormItemProps } from "antd";
/**
 *  渲染单个表单控件
 * @param {object} props 渲染表单控件参数
 * @param {string | undefined} inputType  控件类型,如input
 * @param {ReactNode | string | undefined} label: 表单label
 * @param {string,Array{string}} name: 表单标识name
 * @param {object | undefined} inputParam:表单控件的参数参考antd
 * @param {object | undefined} formItemParam:表单<Form.Item />的参数
 * @param {boolean} noFormItem: 是否需要 <Form.Item /> 包裹，默认需要为true, 可以配置自定义的表单
 * @param {Function | undefined} render: 自定义整个表单控件参数(优先级最高)
 * @returns ReactNode
 */

export interface IWidgetProps {
  inputType: IwidgetType;
  name?: string | Array<string>;
  label?: ReactNode;
  formItemParam?: FormItemProps;
  noFormItem?: boolean;
  inputParam?: IWidgetListProps[IWidgetProps["inputType"]];
  render?: (arg: Omit<IWidgetProps, "render">) => ReactNode;
  [key: string]: any;
}

const CtrRenderFormItemBase: React.FC<IWidgetProps> = memo((props) => {
  let {
    inputType,
    label,
    name,
    inputParam = {},
    formItemParam = {},
    noFormItem = false,
    render,
    ...baseProps
  } = props;
  // let RenderCtr: any = ControlList[inputType];
  const WidgetComponent = ControlList[inputType] as React.ComponentType<any>; // 使用类型断言
  let dom;
  if (typeof props.render === "function") {
    let { render, ...params } = props;
    dom = render(params);
  } else {
    dom = noFormItem ? (
      WidgetComponent && <WidgetComponent {...props} />
    ) : (
      <Form.Item
        {...formItemParam}
        className={`attr-form-item attr-form-item-${inputType || ""} ${
          formItemParam.className || ""
        }`}
        label={label}
        name={name}
      >
        {WidgetComponent && (
          <WidgetComponent {...baseProps} {...inputParam}>
            {baseProps.children}
          </WidgetComponent>
        )}
      </Form.Item>
    );
  }
  return dom;
});

const CtrRenderFormItem: React.FC<IWidgetProps> = memo((props) => {
  let { mutex, shouldUpdate, ...baseProps } = props;
  let rowindex = props.rowindex;
  return shouldUpdate === undefined ? (
    <CtrRenderFormItemBase {...baseProps} />
  ) : (
    <Form.Item
      noStyle
      shouldUpdate={
        rowindex !== undefined
          ? (prevValues: any, curValues: any) =>
              shouldUpdate(prevValues[rowindex], curValues[rowindex])
          : shouldUpdate
      }
    >
      {(form) => {
        let result = mutex?.(form, baseProps);
        if (typeof result === "boolean") {
          return result ? <CtrRenderFormItemBase {...baseProps} /> : null;
        }
        return <CtrRenderFormItemBase {...baseProps} {...(result || {})} />;
      }}
    </Form.Item>
  );
});

export default CtrRenderFormItem;
