import React from "react";
import axios from "axios";
import BpiCRUDTable from "./BpiCRUDTable";
// UI套件庫 antd
import { Form, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
// Component's Base CSS
import "./App.css";
import "./index.css";
import "antd/dist/antd.css";
import BpiTable from "./BpiTable";


const codeMaxLength = 3;

const styles = {
  container: { margin: "auto", width: "fit-content", textAlign: 'center' },
};

class BpiIndex extends React.Component {

  constructor(props) {
    super(props);
    // State: 應用程式狀態
    this.state = {
      code: "",
    };
  }

  setCode = (value) => {
    console.log(value);
    this.setState({ code: value });
  };

  select = () => {
    const code = this.state.code;
    console.log(code);
    if (code !== undefined) {
    } else {
    }
  };

  render() {
    return (
      <>
        {/* Bpi index 首頁  */}
        <div style={styles.container}>
          <h1>各國貨幣資料查詢</h1>
          <Form name="bpiForm" layout="inline">
            <Form.Item
              label="幣別"
              name="code"
              rules={[{ required: false, message: "請輸入幣別" }]}
              normalize={(value) => value.toUpperCase()}
            >
              <Input
                value={this.state.code}
                placeholder={"TWD"}
                maxLength={codeMaxLength}
                onChange={(e) => this.setCode(e.target.value.toUpperCase())}
              />
            </Form.Item>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={this.select}
            >
              查詢
            </Button>
          </Form>
        </div>
        <br />
        <BpiTable />
        {/* <BpiCRUDTable /> */}
      </>
    );
  }
}

export default BpiIndex;
