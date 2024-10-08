import { FC, PropsWithChildren } from "react";
interface Iprops {
  [key: string]: any;
}
const XSetting: FC<PropsWithChildren<Iprops>> = ({ selectData = {} }) => {
  return <div>配置:ID-{selectData.id}</div>;
};

export default XSetting;
