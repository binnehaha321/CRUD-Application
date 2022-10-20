import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button, Col, Input, Row, Spin, Typography, Form } from "antd";
import { ToastContainer } from "react-toastify";
import { Heading } from "~/components/Layout";
import styles from "./index.module.scss";
import { MailOutlined } from "@ant-design/icons";

function ResetPassword() {
  const [isLoaded, setIsLoaded] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = (values) => {};
  return (
    <Row
      type="flex"
      justify="center"
      align="middle"
      style={{ minHeight: "100vh" }}
      className={styles.row}
    >
      <ToastContainer />
      {isLoaded ? (
        <Col
          xl={{ span: 8 }}
          lg={{ span: 10 }}
          md={{ span: 12 }}
          sm={{ span: 16 }}
          xs={{ span: 22 }}
          className={styles.col}
        >
          <Heading level={2} align="center" />
          <Row type="flex" justify="center" style={{ marginBottom: "50px" }}>
            <Col align="center">
              <Typography.Title level={4}>RESET PASSWORD</Typography.Title>
              <Typography.Text>
                Enter your email to reset your password
              </Typography.Text>
            </Col>
          </Row>
          <Form
            layout="vertical"
            name="signin"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input
                type="email"
                placeholder="Enter your email"
                suffix={<MailOutlined />}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                RESET PASSWORD
              </Button>
            </Form.Item>
            <Form.Item>
              <Typography.Text>
                Remember your password?
                <Link className={styles["reset-pw"]} to="../sign-in">
                  {" "}
                  Sign In
                </Link>
              </Typography.Text>
            </Form.Item>
          </Form>
        </Col>
      ) : (
        <Spin />
      )}
    </Row>
  );
}

export default ResetPassword;
