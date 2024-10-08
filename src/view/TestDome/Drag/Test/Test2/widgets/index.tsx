import { Input } from "antd";

const CtrString = (props) => (
  <div>
    {props.label}: {<Input />}
  </div>
);
const CtrContainer = (props) => <div>{props.children}</div>;

export default {
  String: CtrString,
  Container: CtrContainer,
};
