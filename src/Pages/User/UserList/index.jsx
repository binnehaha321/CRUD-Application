import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Space,
  Modal,
  Typography,
  Tag,
  DatePicker,
  Button as Btn,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import moment from "moment";
import * as icon from "~/assets/images/ActionIcons";
import { Table, Button } from "~/components";
import request, { get } from "~/utils/request";
import { ADMIN, USER } from "~/constants/role";
import { UPDATE_USER_FAIL } from "~/utils/message";
import DepartmentSelect from "~/components/DepartmentSelect/DepartmentSelect";
import "./index.scss";
import { handleUserDataList } from "~/utils/handleList";
import { useDispatch, useSelector } from "react-redux";
import { storeDepartmentList, storeRoleList } from "~/store/actions/userAction";

function UserList() {
  const formRef = useRef();
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <Typography.Text
          style={{ width: 100 }}
          ellipsis={{ tooltip: { email } }}
          className="need-lowercase"
        >
          {email}
        </Typography.Text>
      ),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Role",
      dataIndex: "roles",
      key: "roles",
      width: 250,
      render: (roles) => {
        return roles.map((role, index) => (
          <Tag
            key={index}
            color={
              role.roleName === ADMIN
                ? "volcano"
                : role.roleName === USER
                ? "blue"
                : "green"
            }
          >
            {role.roleName}
          </Tag>
        ));
      },
    },
    {
      title: "",
      key: "action",
      render: (student) => (
        <Space size="middle">
          <Button onClick={() => handleGetUserUpdate(student.username)}>
            <img src={icon.EDIT} alt="edit" />
          </Button>
          <Button onClick={() => showDeleteConfirm(student.key)}>
            <img src={icon.DELETE} alt="delete" />
          </Button>
        </Space>
      ),
    },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([
    {
      key: "",
      userId: "",
      avatar: "",
      email: "",
      fullName: "",
      username: "",
      phoneNumber: "",
      roles: [],
    },
  ]);

  const [currentUserValues, setCurrentUserValues] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const { roles, departments } = useSelector((state) => state.user);

  // get user list
  const handleCallUserList = async () => {
    setIsLoading(true);
    try {
      const res = await request.get("users/all?pageNumber=1");
      const users = await res?.data?.data;
      const result = handleUserDataList(await users);
      setData(result);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw new Error(error);
    }
  };

  useEffect(() => {
    handleCallUserList();
    handleGetDepartments();
    handleGetRoles();
  }, []);

  // UPDATE USER
  const [form] = Form.useForm();

  // Get current user's data by id
  useEffect(() => {
    if (formRef.current) {
      form.setFieldsValue(currentUserValues);
    }
  }, [form, currentUserValues]);

  // get user to update
  const handleGetUserUpdate = async (username) => {
    setUsername(username);
    try {
      const res = await request.get(
        `users/filter?pageNumber=1&search=username:${username}`
      );
      const user = res?.data?.data[0];
      setCurrentUserValues({
        key: user?.userId,
        dob: moment(user?.dob),
        email: user?.email,
        fullName: user?.fullName,
        departmentId: user?.departmentId?.departmentId,
        username: user?.username,
        address: user?.address,
        phoneNumber: user?.phoneNumber,
        role: user?.roles?.map((role) => role.roleName),
      });

      setIsModalOpen(true);
    } catch (error) {
      throw new Error(error);
    }
  };

  // get role list
  const handleGetRoles = async () => {
    try {
      const res = await get("role/all?pageNumber=1");
      // setRoles(res);
      dispatch(storeRoleList(await res));
    } catch (error) {
      console.log(error);
    }
  };

  // handle close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsLoading(false);
  };

  // get department list
  const handleGetDepartments = async () => {
    setIsLoading(true);
    try {
      const res = await get("department/all?pageNumber=1");
      dispatch(storeDepartmentList(await res?.data));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw new Error(error);
    }
  };

  // handle update user
  const handleUpdateUser = async (values) => {
    setIsLoading(true);
    try {
      const res = await request.put(`users/edit/${username}`, values);
      const data = await res?.data;
      toast.success(await data?.message);
      handleCloseModal();
    } catch (error) {
      toast.error(UPDATE_USER_FAIL);
      handleCloseModal();
      throw new Error(error);
    }
  };

  // DELETE USER
  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const res = await request.delete(`users/delete/${id}`);
      toast.success(await res?.data?.message);
      setData(data.filter((d) => d.userId !== id));
      setIsLoading(false);
    } catch (error) {
      toast.error(error?.data?.message);
      setIsLoading(false);
    }
  };

  // Confirm modal
  const showDeleteConfirm = (id) => {
    Modal.confirm({
      title: "Are you sure to delete this user?",
      icon: <ExclamationCircleOutlined />,
      content: "Click No to cancel.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",

      onOk() {
        handleDelete(id);
      },
    });
  };

  return (
    <>
      <Table
        caption="User List"
        icon={icon.SORT}
        columns={columns}
        dataSource={data}
        loading={isLoading}
      >
        <Link to="./add">
          <Btn type={"primary"}>ADD NEW USER</Btn>
        </Link>
      </Table>
      <Modal
        title="UPDATE A USER"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form
          ref={formRef}
          onKeyPress={(e) => {
            if (e.key === "Enter") form.submit();
          }}
          labelCol={{
            span: 24,
          }}
          wrapperCol={{
            span: 24,
          }}
          layout="vertical"
          form={form}
          onFinish={handleUpdateUser}
          initialValues={currentUserValues}
          className="update-user"
        >
          <Space style={{ display: "flex" }}>
            <Form.Item label="Role" name="role">
              <Select allowClear maxTagCount="responsive" mode={"multiple"}>
                {roles?.map((role) => (
                  <Select.Option value={role.roleName} key={role.roleId}>
                    {role.roleName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Dob" name={"dob"}>
              <DatePicker format="DD-MM-YYYY" />
            </Form.Item>
            <DepartmentSelect departments={departments} />
          </Space>
          <Space style={{ display: "flex" }}>
            <Form.Item label="Fullname" name="fullName">
              <Input className="need-capitalize" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input type="email" />
            </Form.Item>
          </Space>
          <Space style={{ display: "flex" }}>
            <Form.Item label="Phone Number" name="phoneNumber">
              <Input type="number" />
            </Form.Item>
          </Space>
          <Form.Item label="Address" name="address">
            <Input.TextArea
              maxLength="255"
              showCount="true"
              autoSize={{ minRows: 5 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default UserList;
