import {
  InputNumber,
  InputNumberProps,
  Switch,
  SwitchProps,
  Input,
  InputProps,
} from "antd";

export interface IWidgetListProps {
  inputNumber: InputNumberProps;
  switch: SwitchProps;
  input: InputProps;
}

const widgetList: Record<IwidgetType, React.ComponentType<any>> = {
  inputNumber: InputNumber,
  switch: Switch,
  input: Input,
};

export type IwidgetType = keyof IWidgetListProps;

// 以上代码有一个问题，无法根据inputType 的枚举正确推导出对应inputParam 的类型，请问怎么解决，根据inputType 的枚举可以正确推导出对应的IWidgetListProps列出的类型
// export type IwidgetType = keyof IWidgetListProps;
export default widgetList;
