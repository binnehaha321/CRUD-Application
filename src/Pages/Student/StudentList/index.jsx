import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Space,
  Input,
  Select,
  Modal,
  DatePicker,
  Form,
  Typography,
  Popover,
  Button as Btn,
  Tooltip,
} from "antd";
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { toast } from "react-toastify";
import moment from "moment";
import { Table, Button } from "~/components";
import * as icon from "~/assets/images/ActionIcons";
import request, { get } from "~/utils/request";
import UploadCSV from "~/components/UploadCSV/UploadCSV";
import StudentDetail from "~/components/StudentDetail";
import FilterSearch from "~/components/FilterSearch/FilterSearch";
import { handleStudentDataList } from "~/utils/handleList";
import MajorList from "~/components/MajorList/MajorList";
import { openAssignModalByFptId } from "~/store/actions/studentClassAction";
import "./index.scss";

function StudentList() {
  const formRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStudentValues, setCurrentStudentValues] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterSearchOpen, setIsFilterSearchOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedId, setSelectedId] = useState("");
  const columns = [
    {
      title: "FPT ID",
      dataIndex: "fptId",
      key: "fptId",
      render: (fptId) => (
        <Typography.Text className="need-uppercase">{fptId}</Typography.Text>
      ),
    },
    {
      title: "Fullname",
      dataIndex: "fullName",
      key: "fullName",
      render: (fullName) => (
        <Tooltip
          placement="topLeft"
          title={"Double click on to view student's details"}
          color={"#feaf00"}
        >
          <Typography.Text className="need-capitalize">
            {fullName}
          </Typography.Text>
        </Tooltip>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <a className="need-lowercase" href={`mailto:${email}`}>
          {email}
        </a>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: (
        <UploadCSV
          url={
            "https://webapp-backend-379318.as.r.appspot.com/student/insert/score/file"
          }
          file={"scores"}
          type={"dashed"}
          upload_name={"Upload Scores"}
        />
      ),
      key: "action",
      render: (id) => (
        <Space size="middle">
          <Button onClick={(e) => handleGetStudentUpdate(e, id.key)}>
            <img src={icon.EDIT} alt="edit" />
          </Button>
          <Button onClick={(e) => showDeleteConfirm(e, id.key)}>
            <img src={icon.DELETE} alt="delete" />
          </Button>
          <Popover
            content={
              <Space direction="vertical">
                <Link to={`/students/score/${id.key}`}>
                  <Btn type={"text"} icon={<PlusOutlined />}>
                    Add score
                  </Btn>
                </Link>
                <Link to={"/class"}>
                  <Btn
                    type={"text"}
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenAssignModal(id.key)}
                  >
                    Add to class
                  </Btn>
                </Link>
              </Space>
            }
            title="Select an action"
            trigger="click"
          >
            <Btn type="primary">Add</Btn>
          </Popover>
        </Space>
      ),
    },
  ];
  const [data, setData] = useState([
    {
      key: "",
      fptId: "",
      email: "",
      fullName: "",
      majorId: "",
      gender: "",
      status: "",
      dob: "",
      isActive: false,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [detailStd, setDetailStd] = useState({});

  // toast score
  const { msg, flag } = useSelector((state) => state.score);
  useEffect(() => {
    if (flag) toast.success(msg);
  }, [msg, flag]);

  // GET STUDENT LIST
  const handleCallStudentList = async (pageNumber = 1) => {
    setIsLoading(true);
    try {
      const res = await get(`student/all?pageNumber=${pageNumber}`);
      const students = res?.data;
      const result = handleStudentDataList(students);
      setData(result);
      setTotalItems(res?.pageNumber * 15);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      throw new Error(error);
    }
  };

  // GET MAJOR LIST
  const [majorList, setMajorList] = useState([]);
  const handleGetMajorList = async () => {
    const res = await request.get("major/filter?pageNumber=1&search");
    setMajorList(res?.data?.data);
  };
  useEffect(() => {
    handleGetMajorList();
  }, []);

  // UPDATE STUDENT
  const [form] = Form.useForm();

  useEffect(() => {
    handleCallStudentList(currentPage);
  }, [currentPage]);

  useEffect(() => {
    // Get current student's data by id
    if (formRef.current) form.setFieldsValue(currentStudentValues);
  }, [form, currentStudentValues]);

  const handleGetStudentUpdate = async (e, id) => {
    e.stopPropagation();
    setSelectedId(id);
    try {
      const res = await get(`student/filter?pageNumber=1&search=fptId:${id}`);
      const student = res?.data[0];
      setCurrentStudentValues({
        key: student?.fptId,
        fptId: student?.fptId,
        personId: student?.personId,
        uogId: student?.uogId,
        fullName: student?.fullName,
        majorId: student?.majorId?.majorId,
        email: student?.email,
        gender: student?.gender,
        status: student?.status,
        dob: moment(student?.dob + 1),
        isActive: student?.isActive,
      });
      setIsModalOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateStudent = async (values) => {
    setIsLoading(true);
    try {
      const res = await request.put(`student/edit/${selectedId}`, values);
      const data = res?.data;
      toast.success(data?.message);
      setIsModalOpen(false);
      setIsLoading(false);
    } catch (error) {
      toast.error(error?.data?.message);
      setIsModalOpen(false);
      setIsLoading(false);
    }
  };

  // DELETE STUDENT
  const handleDelete = async (id) => {
    try {
      const res = await request.delete(`student/delete/${id}`);
      toast.success(await res?.data?.message);
      const newStudentList = data.filter((student) => student?.key !== id);
      setData(newStudentList);
    } catch (error) {
      toast.error(error?.data?.message);
      setIsLoading(false);
    }
  };

  // Confirm modal
  const showDeleteConfirm = (e, id) => {
    e.stopPropagation();
    Modal.confirm({
      title: "Are you sure to delete this student?",
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

  // Detail student
  const handleOpenDetailStudent = (record) => {
    setIsOpen(true);
    setDetailStd(record);
  };

  // Handle filter search
  const [formFilter] = Form.useForm();

  const handleFilterSearch = async (values) => {
    let query = "";
    for (const [key, value] of Object.entries(values)) {
      if (value) {
        // only add non-empty values to the query string
        if (query === "") {
          query += `?${key}:${encodeURIComponent(value)}`;
        } else {
          query += `&${key}:${encodeURIComponent(value)}`;
        }
      }
    }
    setIsLoading(true);
    const res = await get(`student/filter?pageNumber=1&search=${query}`);
    setData(res?.data);
    setTotalItems(res?.pageNumber * 15);
    handleCloseFilter();
    setIsLoading(false);
  };

  const handleCloseFilter = () => {
    setIsFilterSearchOpen(false);
    formFilter.resetFields();
  };

  // assign modal
  const dispatch = useDispatch();
  const handleOpenAssignModal = (fptId) => {
    dispatch(openAssignModalByFptId(fptId));
  };

  return (
    <>
      <Table
        caption="Student List"
        onOpenFilter={() => setIsFilterSearchOpen(true)}
        columns={columns}
        dataSource={data}
        loading={isLoading}
        currentPage={currentPage}
        totalItems={totalItems}
        onChange={(pageNumber) => setCurrentPage(pageNumber)}
        onRow={(record) => {
          return {
            onDoubleClick: () => handleOpenDetailStudent(record),
          };
        }}
      >
        <Popover
          content={
            <Space direction="vertical">
              <Link to="../students/add">
                <Btn icon={<UserAddOutlined />} type={"primary"}>
                  ADD NEW STUDENT
                </Btn>
              </Link>
              <UploadCSV
                url="https://webapp-backend-379318.as.r.appspot.com/student/insert/file"
                file={"students"}
                upload_name={"Upload Students"}
              />
            </Space>
          }
          trigger="click"
        >
          <Btn>ADD NEW STUDENT</Btn>
        </Popover>
      </Table>
      {/* Update student */}
      <Modal
        title="UPDATE A STUDENT"
        forceRender
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
          onFinish={handleUpdateStudent}
          initialValues={currentStudentValues}
          className="update-student"
        >
          <Space style={{ display: "flex" }}>
            <Form.Item label="FPT ID" name="fptId">
              <Input className="need-uppercase" readOnly />
            </Form.Item>
            <Form.Item label="Person ID" name="personId">
              <Input />
            </Form.Item>
            <Form.Item label="UOG ID" name="uogId">
              <Input />
            </Form.Item>
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
            <MajorList majors={majorList} />
            <Form.Item label="Gender" name="gender">
              <Select allowClear>
                <Select.Option value="Male">Male</Select.Option>
                <Select.Option value="Female">Female</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="DOB" name="dob">
              <DatePicker />
              {/* <DatePicker format={"DD-MM-YYYY"} /> */}
            </Form.Item>
          </Space>
        </Form>
      </Modal>

      {/* Student detail */}
      <StudentDetail
        open={isOpen}
        onOk={() => setIsOpen(false)}
        title={detailStd?.fullName}
        fptId={detailStd?.fptId}
        email={detailStd?.email}
        gender={detailStd?.gender}
        majorId={detailStd?.majorId}
        dob={detailStd?.dob}
        status={detailStd.status}
        isActive={detailStd?.isActive}
      />

      {/* Filter search */}
      <FilterSearch
        open={isFilterSearchOpen}
        onOk={formFilter.submit}
        onCancel={handleCloseFilter}
        form={formFilter}
        onFinish={handleFilterSearch}
      />
    </>
  );
}

export default StudentList;
