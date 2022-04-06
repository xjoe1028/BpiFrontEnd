import React, {useState} from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Form, Input, Button, Table, Popconfirm, Modal, InputNumber } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import BpiEditForm from "./BpiEditForm";
import { Link } from 'react-router-dom';
import AddAndEditForm from './bpiComponent/AddAndEditForm';

/**
 * 幣別 Table 頁面
 */
class BpiTable extends React.Component {

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

  renderButtonStyle = { marginRight: 10 };

  addButtonStyle = {marginBottom: 10};

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
          <Button type="primary" shape="round" icon={<EditOutlined />} style={this.renderButtonStyle} onClick={() => this.updateBpi()}>
            修改
          </Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => this.deleteBpi()}>
            <Button type="primary" shape="round" danger={true} icon={<DeleteOutlined />} style={this.renderButtonStyle}>
              刪除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  testData = [
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

  selectBpi = (state) => { };

  selectAll = () => { };

  updateBpi = (data) => {
    console.log("修改");
  };

  deleteBpi = (data) => {
    console.log("刪除");
    const location = this.testData.find((t) => t.id === data.id);
    this.testData = this.testData.filter((t) => t.id !== location.id);
    return Promise.resolve(location);
  };

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;

    let item = { ...this.state.item };
    item[name] = value;
    this.setState({ item });
  }

  async handleSubmit(event) {
    const { item } = this.state;

    await fetch("api/", {
      method: item.id ? "POST" : "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    // this.props.history.push();
  }

  render() {
    return (
      <div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={this.addButtonStyle}
          onClick={() => this.setState({ visible: true })}
        >
          新增
        </Button>
        <AddAndEditForm
          visible={this.state.visible}
          item={this.state.item}
          onCreate={this.handleSubmit}
          onCancel={() => {
            this.setState({ visible: false });
          }}
        />
        <Table
          dataSource={this.testData}
          columns={this.columns}
          bordered
          title={() => "幣別資料表"}
        ></Table>
      </div>
    );
  }
}

export default BpiTable;
