import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Button,
  Col,
  Divider,
  Input,
  Space,
  Typography,
  Form,
  Select,
  DatePicker,
} from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import { ToastContainer } from "react-toastify";
import request from "~/utils/request";
import schedule from "./schedule";
import "./index.scss";

function AddNewPayment() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleAddPayment = useCallback(
    (values) => {
      dispatch({ type: "ADD_PAYMENT", payload: values });
      // navigate("../payments");
    },
    [dispatch, navigate]
  );
  const [students, setStudents] = useState([]);
  const [fullName, setFullName] = useState("");

  // GET STUDENT (ID) LIST
  useEffect(() => {
    request
      .get("students?studentId=ALL")
      .then((res) => setStudents(res?.data?.students));
  }, []);

  // Handle select studentId
  const handleSelectStudentId = useCallback((studentId) => {
    request.get(`students?studentId=${studentId}`).then((res) => {
      setFullName(res?.data?.students?.fullName);
    });
  }, []);

  return (
    <Col
      className="py-30"
      xs={{ span: 24 }}
      md={{ span: 20 }}
      lg={{ span: 12 }}
    >
      {" "}
      <ToastContainer />
      <Space direction="horizental" size={"middle"}>
        <DollarCircleOutlined
          style={{ fontSize: "2rem", color: "var(--btn-primary)" }}
        />
        <Typography.Title level={3}>ADD NEW PAYMENT</Typography.Title>
      </Space>
      <Divider />
      <Form
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        layout="vertical"
        onFinish={handleAddPayment}
        className="add-new-payment"
        form={form}
      >
        <Space style={{ display: "flex" }}>
          <Form.Item label="Student ID" name="studentId">
            <Select
              showSearch
              onChange={handleSelectStudentId}
              value={students}
              className="need-uppercase"
            >
              {students.map((student) => (
                <Select.Option
                  key={student.id}
                  value={student.id}
                  className="need-uppercase"
                >
                  {student.studentId}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Fullname" name="fullName">
            <Input
              readOnly
              placeholder={fullName}
              className="need-capitalize"
            />
          </Form.Item>
        </Space>
        <Space style={{ display: "flex" }}>
          <Form.Item label="Payment ID" name="paymentId">
            <Input maxLength={10} minLength={10} className="need-uppercase" />
          </Form.Item>
          <Form.Item label="Payment Schedule" name="paymentSchedule">
            <Select>
              {schedule.map((time, index) => (
                <Select.Option key={index} value={time.value}>
                  {time.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Space>
        <Space style={{ display: "flex" }}>
          <Form.Item label="Bill Number" name="billNumber">
            <Input type="number" prefix="#" />
          </Form.Item>
          <Form.Item label="Amount Paid" name="amountPaid">
            <Input type="number" prefix="$" />
          </Form.Item>
        </Space>
        <Space style={{ display: "flex" }}>
          <Form.Item label="Balance Amount" name="balanceAmount">
            <Input readOnly placeholder={0} />
          </Form.Item>
          <Form.Item label="Payment Date" name="paymentDate">
            <DatePicker format={"YYYY-MM-DD"} />
          </Form.Item>
        </Space>
        <Form.Item align="center">
          <Button type="primary" htmlType="submit">
            Add Payment
          </Button>
        </Form.Item>
      </Form>
    </Col>
  );
}

export default AddNewPayment;
