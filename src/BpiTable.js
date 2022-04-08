import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, Form, Modal, Input} from "antd";
import TextArea from "antd/lib/input/TextArea";
// UI套件庫 antd
import "antd/dist/antd.css";
import React from "react";
import AddAndEditForm from "./bpiComponent/AddAndEditForm";
import { FormInstance } from 'antd/lib/form';
import { useForm } from "antd/lib/form/Form";

let testData = [
  {
    id: 1,
    code: "TWD",
    codeChineseName: "新台幣",
    rate: "11.23213",
    description: "New Taiwan Dollar",
  },
  {
    id: 2,
    code: "USD",
    codeChineseName: "美金",
    rate: "123",
    description: "Unite Dollar",
  },
  {
    id: 3,
    code: "NMD",
    codeChineseName: "xx",
    rate: "13.2",
    description: "xx",
  },
];

/**
 * 幣別 Table 頁面
 */
class BpiTable extends React.Component {

  formRef = React.createRef(); // 定義一個表單

  renderButtonStyle = { marginRight: 10 };

  addButtonStyle = { marginBottom: 10 };

  constructor(props) {
    super(props);
    // State: 應用程式狀態
    this.state = {
      item: {
        code: "",
        codeChineseName: "",
        rate: "",
        description: "",
      },
      visible: false,
    };

  }

  columns = [
    {
      title: "序號",
      dataIndex: "id",
      key: "id",
      defaultSortOrder: "ascend", // 預設排列: ascend 升冪, descend 降冪
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "貨幣名稱",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "貨幣中文名稱",
      dataIndex: "codeChineseName",
      key: "codeChineseName",
    },
    {
      title: "匯率",
      dataIndex: "rate",
      key: "rate",
      defaultSortOrder: "ascend", // 預設排列: ascend 升冪, descend 降冪
      sorter: (a, b) => parseFloat(a.rate) - parseFloat(b.rate),
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "操作",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            shape="round"
            icon={<EditOutlined />}
            style={this.renderButtonStyle}
            onClick={() => this.updateBpi(record)}
          >
            修改
          </Button>
          <Popconfirm
            title="確定刪除?"
            onConfirm={() => this.deleteBpi(record)}
          >
            <Button
              type="primary"
              shape="round"
              danger={true}
              icon={<DeleteOutlined />}
              style={this.renderButtonStyle}
            >
              刪除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  /**
   * 新增
   */
  addBpi() {
    console.log("新增")
    this.setState({ visible: true, item: {} }, () => {
      const bpi = this.state.item;
      this.formRef.current.setFieldsValue({
        // 對應到 <Form.Item></Form.Item> 的 name 屬性
        code: bpi.code,
        codeChineseName: bpi.codeChineseName,
        rate: bpi.rate,
        description: bpi.description,
        remember: false,
      });
    });
  }

  /**
   * 修改
   *
   * @param {*} data
   */
  updateBpi = (data) => {
    console.log("修改");
    this.setState({ visible: true, item: data }, () => {
      const bpi = this.state.item;
      this.formRef.current.setFieldsValue({
        // 對應到 <Form.Item></Form.Item> 的 name 屬性
        code: bpi.code,
        codeChineseName: bpi.codeChineseName,
        rate: bpi.rate,
        description: bpi.description,
        remember: false,
      });
    });
  };

  /**
   * 刪除
   *
   * @param {*} data
   * @returns
   */
  deleteBpi = (data) => {
    console.log("刪除");
    const bpi = testData.find((t) => t.id === data.id);
    testData = testData.filter((t) => t.id !== bpi.id);
    console.log(testData);
    return Promise.resolve(bpi);
  };

  /**
   * 文本框改變的事件
   *
   * @param {*} event
   */
  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    let {item} = this.state;
    item[name] = value;
    this.setState({ item: item });
  }

  /**
   * 新增 修改 表單 submit
   *
   * @param {*} event
   */
  handleSubmit(event) {
    console.log("欄位檢核");
    this.formRef.current.validateFields()
      .then((values) => {
        this.formRef.resetFields();
      })
      .catch((info) => console.log("Validate Failed:", info));

    const { item } = this.state;

    this.addAndUpdateBpi(item)
  
    // this.props.history.push();
  }

  async addAndUpdateBpi(data) {
    await fetch("api/", {
      method: data.id ? "POST" : "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  /**
   * 按下新增修改彈出表單取消按鈕
   */
  onCancel() {
    this.setState({ visible: false, item: {} }, () => {
      const bpi = this.state.item;
      this.formRef.current.setFieldsValue({
        // 對應到 <Form.Item></Form.Item> 的 name 屬性
        code: bpi.code,
        codeChineseName: bpi.codeChineseName,
        rate: bpi.rate,
        description: bpi.description,
        remember: false,
      });
    });
  }

  render() {
    return (
      <>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={this.addButtonStyle}
          onClick={() => this.addBpi()}
        >
          新增
        </Button>
        {/* 新增修改彈出表單 */}
        <Modal
          forceRender={true}
          visible={this.state.visible} 
          title={this.state.item.id ? "編輯幣別" : "新增幣別"}
          okText={this.state.item.id ? "編輯" : "新增"}
          cancelText="取消"
          onOk={() => this.handleSubmit()}
          onCancel={() => this.onCancel()}
        >
          <Form name="bpiEditForm" layout="vertical" ref={this.formRef}>
            <Form.Item
              label="幣別"
              name="code"
              rules={[{ required: true, message: "請輸入幣別" }]}
            >
              <Input
                value={this.state.item.code || ""}
                placeholder="TWD"
                maxLength={3}
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Item>
            <Form.Item
              label="幣別中文名稱"
              name="codeChineseName"
              rules={[{ required: true, message: "請輸入幣別中文名稱" }]}
            >
              <Input
                value={this.state.item.codeChineseName || ""}
                placeholder="新台幣"
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Item>
            <Form.Item
              label="利率"
              name="rate"
              rules={[
                { required: true, message: "請輸入利率" },
                { pattern: new RegExp("^[0-9]+(.[0-9]+)?$", "g"), message: "利率必須為數字"},
              ]}
            >
              <Input
                value={this.state.item.rate || ""}
                onChange={(e) => this.handleChange(e)}
              />
            </Form.Item>
            <Form.Item
              label="描述"
              name="description"
              rules={[{ required: false, message: "請輸入描述" }]}
            >
              <TextArea
                value={this.state.item.description || ""}
                onChange={(e) => this.handleChange(e)}
                maxLength={200}
                rows={5}
              />
            </Form.Item>
          </Form>
        </Modal>
        <div>
          <Table
            dataSource={testData}
            columns={this.columns}
            bordered
            title={() => "幣別資料表"}
          ></Table>
        </div>
      </>
    );
  }
}

export default BpiTable;
