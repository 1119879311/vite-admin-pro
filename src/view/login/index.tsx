import { Form, Input, Button, Checkbox, message } from "antd";


import { useNavigate } from "react-router-dom";

import "./index.less";
const layout = { labelCol: { span: 8 }, wrapperCol: { span: 12 } };
const tailLayout = { wrapperCol: { offset: 8, span: 12 } };

//@ts-ignore
const LoginApp = () => {
  const navigate = useNavigate();
  const onFinish = async (values:Record<string,string>) => {
    try {
      message.success("登录成功，正在跳转...")
      navigate("/admin")
    } catch (error) {
      // message.error("服务器异常，请类型管理员")
      
    }
  };
  return (
    <div className="login-warp">
      <div className="login-main">
        <Form
          {...layout}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="账号"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="请输入账号" />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item {...tailLayout} name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default LoginApp;
