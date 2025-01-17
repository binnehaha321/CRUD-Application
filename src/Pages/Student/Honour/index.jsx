import { useEffect, useState } from "react";
import { Form, Select, Modal, Typography, Divider, Card } from "antd";
import { Table } from "~/components";
import request, { get } from "~/utils/request";
import useFetch from "~/hooks/useFetch";
import { formatHonourList } from "~/utils/handleList";
import StudentScore from "~/components/StudentScore";

function HonourList() {
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
        <Typography.Text className="need-capitalize">
          {fullName}
        </Typography.Text>
      ),
    },
    {
      title: "Major",
      dataIndex: "majorName",
      key: "majorName",
    },
    {
      title: "Subject",
      dataIndex: "subjectCode",
      key: "subjectCode",
    },
    {
      title: "Term",
      dataIndex: "termCode",
      key: "termCode",
    },
    {
      title: "Studied",
      dataIndex: "numberSubjectStudiedInTheTerm",
      key: "numberSubjectStudiedInTheTerm",
    },
    {
      title: "Mark",
      dataIndex: "mark",
      key: "mark",
    },
    {
      title: "Avg Score",
      dataIndex: "averageScore",
      key: "averageScore",
      render: (score) => (
        <Typography.Text>{score && Number(score).toFixed(1)}</Typography.Text>
      ),
    },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  // GET PROGRAM LIST
  const { data: programList } = useFetch("program/all?pageNumber=1");
  // GET MAJOR LIST
  const { data: termList } = useFetch("term/all?pageNumber=1");
  // GET MAJOR LIST
  const { data: majorList } = useFetch("major/all?pageNumber=1");

  // get honour list
  const getHonourList = async (values) => {
    setIsLoading(true);
    if (values) {
      const { programId, termCode, majorId } = values;
      try {
        const res = await request(
          `student/get/honorList/${programId}/${termCode}/${majorId}`
        );
        const data = formatHonourList(await res?.data?.data);
        setData(data);
        handleCloseModal();
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        throw new Error(error);
      }
    } else {
      setIsLoading(false);
      return;
    }
  };

  useEffect(() => {
    getHonourList();
  }, []);

  // handle close modal
  const [form] = Form.useForm();
  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  // get student score by id
  const [isOpenStudentScore, setIsOpenStudentScore] = useState(false);
  const [studentScoreData, setStudentScoreData] = useState([]);
  const [modalTitle, setModalTitle] = useState("");
  const [subjectTab, setSubjectTab] = useState([
    {
      key: "",
      tab: "",
    },
  ]);

  // get score
  const handleGetStudentScore = async (id) => {
    if (id) {
      setIsOpenStudentScore(true);
      try {
        const res = await get(`student/get/score/${id}`);
        const tabs = formatTab(await res?.data);
        setSubjectTab(tabs);
        setStudentScoreData(await res?.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // format tab
  const formatTab = (list = []) => {
    return list.map((item) => {
      const res = {
        key: item?.studentSubjectId?.subjectCode?.subjectCode,
        tab: item?.studentSubjectId?.subjectCode?.subjectCode,
      };
      return res;
    });
  };
  const [activeTabKey, setActiveTabKey] = useState(subjectTab[0]?.key);
  const onTabChange = (key) => {
    setActiveTabKey(key);
  };

  return (
    <>
      <Modal
        open={isOpenModal}
        onCancel={handleCloseModal}
        title="FILTER HONOURS"
        forceRender
        onOk={() => form.submit()}
      >
        <Form
          layout={"vertical"}
          form={form}
          onFinish={getHonourList}
          onKeyPress={(e) => {
            if (e.key === "Enter") form.submit();
          }}
        >
          <Form.Item
            label="Program"
            name={"programId"}
            rules={[
              {
                required: true,
                message: "Please select program!",
              },
            ]}
          >
            <Select allowClear>
              {programList?.data?.map((item) => (
                <Select.Option key={item.programId} value={item.programId}>
                  {item.programName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Term"
            name={"termCode"}
            rules={[
              {
                required: true,
                message: "Please select term!",
              },
            ]}
          >
            <Select allowClear>
              {termList?.data?.map((item) => (
                <Select.Option key={item.termCode} value={item.termCode}>
                  {item.termName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Major"
            name={"majorId"}
            rules={[
              {
                required: true,
                message: "Please select major!",
              },
            ]}
          >
            <Select allowClear>
              {majorList?.data?.map((item) => (
                <Select.Option key={item.majorId} value={item.majorId}>
                  {item.majorCode}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        caption="Honours List"
        columns={columns}
        dataSource={data}
        loading={isLoading}
        onOpenFilter={() => setIsOpenModal(true)}
        onRow={(record) => {
          return {
            onDoubleClick: () => {
              handleGetStudentScore(record?.fptId);
              setModalTitle(
                `${record?.fullName} (${record?.fptId}) - ${record?.majorName}`
              );
            },
          };
        }}
      />

      {/* Student score by id */}
      <Modal
        open={isOpenStudentScore}
        onOk={() => setIsOpenStudentScore(false)}
        cancelButtonProps={{ style: { display: "none" } }}
        closable={false}
        title={modalTitle}
      >
        <Divider />
        <Card
          style={{
            width: "100%",
          }}
          title="Card title"
          tabList={subjectTab}
          activeTabKey={activeTabKey}
          onTabChange={onTabChange}
        >
          {studentScoreData.map((data, index) => (
            <StudentScore
              key={index}
              program={data?.studentSubjectId.programId.programName}
              term={data?.studentSubjectId.termCode.termName}
              subject={data?.studentSubjectId.subjectCode.subjectName}
              mark={data?.mark}
              status={data?.status}
              tabList={subjectTab}
            />
          ))}
        </Card>
      </Modal>
    </>
  );
}

export default HonourList;
