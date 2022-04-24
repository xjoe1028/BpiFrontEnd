import React from "react";
// UI套件庫 antd
import { DeleteOutlined, EditOutlined, PlusOutlined, RollbackOutlined } from "@ant-design/icons";
import { Button, Popconfirm, Table, Form, Modal, Input} from "antd";
import TextArea from "antd/lib/input/TextArea";
import axios from "./bpiComponent/axios";
import "antd/dist/antd.css";
import "./index.css";

const renderButtonStyle = { marginRight: 10 };
const indexButtonStyle = {marginLeft: 10};
const firstLineButtonStyle = { marginBottom: 10, marginLeft: 10 };
const addUrl= '/addBpi';
const updateUrl = '/updateBpi';
const deleteUrl = '/deleteBpi/code';

/**
 * 幣別 Table 頁面
 */
class BpiTable extends React.Component {

  formRef = React.createRef(); // 定義一個表單

  constructor(props) {
    super(props);
    // State: 應用程式狀態
    this.state = {
      item: {},
      visible: false,
      allBpi: props.allBpi,
    };


    this.redirectIndex = this.redirectIndex.bind(this);
    this.callParent = this.callParent.bind(this);
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
            style={renderButtonStyle}
            onClick={() => this.updateBpiForm(record)}
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
              style={renderButtonStyle}
            >
              刪除
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  /**
   * 按下 新增表單 彈出
   */
  addBpiForm() {
    console.log("新增");
    this.setState({ visible: true, item: {}, method: 'post' }, () => {
      const param = this.state.item;
      this.formRef.current.setFieldsValue({
        // 對應到 <Form.Item></Form.Item> 的 name 屬性
        code: param.code,
        codeChineseName: param.codeChineseName,
        rate: param.rate,
        description: param.description,
        remember: false,
      });
    });
  }

  /**
   * 按下 修改表單 彈出
   *
   * @param {*} data
   */
  updateBpiForm(data) {
    console.log("修改");
    this.setState({ visible: true, item: data, method: 'put' }, () => {
      const param = this.state.item;
      this.formRef.current.setFieldsValue({
        // 對應到 <Form.Item></Form.Item> 的 name 屬性
        code: param.code,
        codeChineseName: param.codeChineseName,
        rate: param.rate,
        description: param.description,
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
  deleteBpi(data) {
    console.log("刪除");
    this.axiosMethod(data, 'delete');
  };

  /**
   * 新增 修改 表單 submit
   *
   * @param {*} event
   */
  handleOk() {
    this.formRef.current
      .validateFields()
      .then((values) => this.formRef.current.resetFields())
      .catch((info) => console.log("Validate Failed:", info));

    const data = this.formRef.current.getFieldsValue();

    console.log("data", data);

    this.axiosMethod(data, this.state.method);

    // this.props.history.push();
  }

  /**
   * 按下新增修改彈出表單取消按鈕
   */
  onCancel() {
    this.setState({ visible: false, item: {} }, () => {
      const param = this.state.item;
      this.formRef.current.setFieldsValue({
        // 對應到 <Form.Item></Form.Item> 的 name 屬性
        code: param.code,
        codeChineseName: param.codeChineseName,
        rate: param.rate,
        description: param.description,
        remember: false,
      });
    });
  }

  /**
   * call 父元件(BpiIndex) 的 function 回到初始化頁面
   */
  redirectIndex() {
    this.props.initIndex();
  }

  /**
   * call 父元件(BpiIndex) 的 updateAllBpi
   */
  callParent() {
    console.log(this.state.allBpi);
    this.props.updateAllBpi(this.state.allBpi);  // 子元件通過此觸發父元件的回撥方法
  }

  /**
   * axios 
   * 
   * @param {*} param 
   * @param {*} method 
   */
  async axiosMethod(param, method = 'get') {
    let {allBpi} = this.state;
    console.log('method : ', method);
    console.log('data', param);
    console.log('allBpi', allBpi);

    switch (method) {
      case 'get':
        break;
      case 'post':
        allBpi = [...allBpi, {
          id: allBpi.length + 1,
          code: param.code,
          codeChineseName: param.codeChineseName,
          rate: param.rate,
          description: param.description
        }];

        this.setState({allBpi: allBpi});
        this.onCancel();

        // await axios.post(addUrl, param)
        //   .then((res) => {
        //     const {data} = res;
        //     const {bpi} = res.data;
            
        //     this.handleResponse(res, function() {
        //       this.setState({ allBpi: [...allBpi, bpi] });
        //     });
            
        //     // if (data.code === "0000") {
        //     //   console.log("新增成功");
        //     //   this.setState({ allBpi: [...allBpi, bpi] });
        //     // } else {
        //     //   const { message } = data;
        //     //   alert(message);
        //     // }
        //   })
        //   .catch((err)=>{
        //     console.log(err);
        //   });
        
        break;
      case 'put':
        allBpi = allBpi.map((b) => {
          if (b.code === param.code) {
            return {
              id: b.id,
              code: param.code,
              codeChineseName: param.codeChineseName,
              rate: param.rate,
              description: param.description,
            };
          } else {
            return b;
          }
        });
        this.setState({ allBpi: allBpi });

        // await axios.put(updateUrl, param)
        //   .then((res)=>{
        //     const {data} = res;
        //     const {param} = res.data;
        //     if (data.code === "0000") {
        //       console.log("修改成功");
        //       allBpi = allBpi.map(b => {
        //         if(b.code === param.code) {
        //           return {id: b.id, code:param.code, codeChineseName: param.codeChineseName, rate: param.rate, description: param.description}
        //         } else {
        //           return b;
        //         }
        //       });
        //       this.setState({ allBpi: allBpi});
        //     } else {
        //       const { message } = data;
        //       alert(message);
        //     }
        //   })
        //   .catch((err)=>{
        //     console.log(err);
        //   });
        this.onCancel();
        break;
      case 'patch':
        // await axios.patch(patchUrl, param)
        //   .then((res)=>{

        //   })
        //   .catch((err)=>{
        //     console.log(err);
        //   });
        this.onCancel();
        break;
      case 'delete':
        this.setState({ allBpi: allBpi.filter(b => b.code !== param.code) });
        this.callParent();

        // await axios.delete(deleteUrl, param)
        //   .then((res)=>{

        //   })
        //   .catch((err)=>{
        //     console.log(err);
        //   });
        break;
      default:
        break;
    }
  }

  handleResponse(res,fn) {
    const {data} = res;
    const {bpi} = res.data;
    if (data.code === "0000") {
      fn();
    } else {
      const { message } = data;
      alert(message);
    }
  }

  // /**
  //  * 這個函式需要回傳一個布林值，當元件判斷是否需要更新 DOM 時會被觸發。
  //  * @param {*} nextProps 
  //  * @param {*} nextState 
  //  */
  // shouldComponentUpdate(nextProps, nextState){
  //   console.log('nextProps', nextProps);
  //   console.log('nextState', nextState);
  //   return true;
  // }

  // /**
  //  * Updating 階段最後一個執行，在畫面渲染更新後調用，新版本的還多加 getSnapshotBeforeUpdate 傳遞的參數。
  //  * 在這邊可以處理 call api 動作，或是 setState，促使重新更新，但提醒記得要判斷執行時機，否則一樣會進入無限迴圈。
  //  * 
  //  * @param {*} prevProps 
  //  * @param {*} prevState 
  //  * @param {*} snapshot 
  //  */
  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   console.log('prevProps',prevProps);
  //   console.log('props', this.props);
  //   console.log('prevState',prevState)
  //   if (this.props.allBpi !== prevState.allBpi) {
  //       this.setState({allBpi: this.state.allBpi});
  //   } 
  // }

  render() {

    return (
      <div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={firstLineButtonStyle}
          onClick={() => this.addBpiForm()}
        >
          新增
        </Button>
        <Button
          type="primary"
          icon={<RollbackOutlined />}
          style={indexButtonStyle}
          onClick={this.redirectIndex}
        >
          回首頁
        </Button>
        {/* 新增修改彈出表單 */}
        <Modal
          forceRender={true}
          visible={this.state.visible}
          title={this.state.item.id ? "編輯幣別" : "新增幣別"}
          okText={this.state.item.id ? "編輯" : "新增"}
          cancelText="取消"
          onOk={() => this.handleOk()}
          onCancel={() => this.onCancel()}
        >
          <Form name="paramEditForm" layout="vertical" ref={this.formRef}>
            <Form.Item
              label="幣別"
              name="code"
              rules={[
                { required: true, message: "請輸入幣別" },
                { pattern: new RegExp("[a-zA-Z]", "g"), message: "請輸入英文" }, // g 全域搜索
              ]}
              normalize={(value) => value.toUpperCase()} // 自動轉大寫
            >
              <Input placeholder="TWD" maxLength={3} />
            </Form.Item>
            <Form.Item
              label="幣別中文名稱"
              name="codeChineseName"
              rules={[{ required: true, message: "請輸入幣別中文名稱" }]}
            >
              <Input placeholder="新台幣" />
            </Form.Item>
            <Form.Item
              label="利率"
              name="rate"
              rules={[
                { required: true, message: "請輸入利率" },
                {
                  pattern: new RegExp("^[0-9]+(.[0-9]+)?$", "g"),
                  message: "利率須為整數或小數",
                }, // g 全域搜索
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="描述" name="description">
              <TextArea maxLength={200} rows={5} />
            </Form.Item>
          </Form>
        </Modal>
        <div>
          <Table
            dataSource={this.state.allBpi}
            columns={this.columns}
            bordered
            title={() => "幣別資料表"}
          ></Table>
        </div>
      </div>
    );
  }
}

export default BpiTable;
