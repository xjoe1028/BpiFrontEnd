import React from "react";
import axios from "./bpiComponent/axios";
import BpiCRUDTable from "./BpiCRUDTable";
import BpiTable from "./BpiTable";
// UI套件庫 antd
import { DeleteOutlined, EditOutlined, PlusOutlined, RollbackOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import { Button, Popconfirm, Table, Form, Modal, Input, Pagination} from "antd";
import { SearchOutlined } from "@ant-design/icons";
// Component's Base CSS
import "./App.css";
import "./index.css";
import "antd/dist/antd.css";

const styles = {
  container: { margin: "auto", width: "fit-content", textAlign: "center" },
};

const renderButtonStyle = { marginRight: 10 };
const indexButtonStyle = {marginLeft: 10};
const firstLineButtonStyle = { marginBottom: 10, marginLeft: 10 };
const addUrl= '/addBpi';
const updateUrl = '/updateBpi';
const deleteUrl = '/deleteBpi/code';
const selectAllUrl = "/findAllBpis";
const selectOneUrl = "/findBpi/code";

const testData = [
  {
    id: 1,
    code: "TWD",
    codeChineseName: "新台幣",
    rate: "123",
    description: "New Taiwan Dollar",
  },
  {
    id: 2,
    code: "TWD2",
    codeChineseName: "新台幣2",
    rate: "123",
    description: "New Taiwan Dollar2",
  },
  {
    id: 3,
    code: "TWD3",
    codeChineseName: "新台幣2",
    rate: "123",
    description: "New Taiwan Dollar3",
  },
];

const defaultPageSize = 10;
class BpiIndex extends React.Component {

  formRef = React.createRef(); // 定義一個表單

  constructor(props) {
    super(props);
    // State: 應用程式狀態
    this.state = {
      code: "",   // 幣別欄位初始值
      item: {},   // 單筆bpi物件
      allBpi: [], // table bpiList
      pageSize: defaultPageSize, // 預設table一頁顯示五筆資料
      hiddenFlag: true, // 新增修改表單顯示flag
    };

    this.redirectIndex = this.redirectIndex.bind(this);
  }

  setCode = (value) => {
    const code = value.toUpperCase();
    this.setState({ code: code });
  };

  /**
   * 按下 新增表單 彈出
   */
  addBpiForm = () => {
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
  updateBpiForm = (data) => {
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
  deleteBpi = (data) => {
    this.axiosMethod(data, 'delete');
  };

  /**
   * 新增 or 修改 表單 按下 submit
   */
  onOk = () => {
    this.formRef.current
      .validateFields()
      .then(values => this.axiosMethod(values, this.state.method))
      .catch(info => {
        console.log("Validate Failed:", info);
        return;
      });
  }

  /**
   * 按下新增修改彈出表單取消按鈕
   */
  onCancel = () => {
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
  redirectIndex = () => {
    this.setState({ allBpi: [], hiddenFlag: true, pageSize: defaultPageSize });
  }

  /**
   * 按下 查詢按鈕
   */
  select = () => {
    const {code} = this.state;
    if (code) {
      this.axiosMethod(code);
    } else {
      this.axiosMethod();
    }
  }

  /**
   * handle get method response
   * 
   * @param {*} res 
   */
   handleGetRes = (res) => {
    const {data} = res;
    let bpiList = [];
    let id = 1;
    if (data.code === "0000") {
      if (data.data.length) {
        bpiList = data.data;
        bpiList.forEach(bpi => bpi.id = id++);
      } else {
        const bpi = data.data;
        bpi.id = id;
        bpiList = [bpi];
      }
      this.setState({allBpi: bpiList});
    } else {
      this.setState({allBpi: []});
      const { message } = data;
      alert(message);
    }
  }

  /**
   * 新增 and 更新 組Rq
   * 
   * @param {*} param 
   * @returns 
   */
  buildRqData = (param) => {
    const addAndUpdateParam = {
      code: param.code,
      codeChineseName: param.codeChineseName,
      rate: param.rate,
      rateFloat: parseFloat(param.rate),
      description: param.description,
    }

    return addAndUpdateParam;
  }

  /**
   * axios call backend restful api
   * 
   * @param {*} param 
   * @param {*} method 
   */
   axiosMethod = async (param, method = 'get') => {
    let {allBpi} = this.state;
    console.log('method : ', method);
    console.log('data : ', param);
    console.log('allBpi', allBpi);

    switch (method) {
      case 'get':
        if (param !== null && param !== undefined && param !== "" && param.length > 0) {
          // this.setState({allBpi: allBpi.filter(b => b.code === code)});
          this.setState({allBpi: allBpi, hiddenFlag: false});
          await axios
            .get(selectOneUrl, { params: { code: param } })
            .then(res => this.handleGetRes(res))
            .catch(err => console.log(err));
        } else {
          // const allBpi = [...testData];
          console.log('selectAll state.Bpi before: ', allBpi);
          this.setState({allBpi: allBpi, hiddenFlag: false});
          await axios
            .get(selectAllUrl)
            .then(res => this.handleGetRes(res))
            .catch(err => console.log(err));
        }
        break;
      case 'post':
        // allBpi = [...allBpi, {
        //   id: allBpi.length + 1,
        //   code: param.code,
        //   codeChineseName: param.codeChineseName,
        //   rate: param.rate,
        //   description: param.description
        // }];

        // this.setState({allBpi: allBpi});
        // this.onCancel();

        await axios
          .post(addUrl, this.buildRqData(param))
          .then(res => {
            const {data} = res;
            const bpi = data.data;
            bpi.id = allBpi.length + 1;

            if (data.code === "0000") {
              console.log("新增成功");
              this.setState({ allBpi: [...allBpi, bpi] });
            } else {
              const { message } = data;
              alert(message);
            }
          })
          .catch(err => console.log(err));
        this.onCancel();
        break;
      case 'put':
        // allBpi = allBpi.map((b) => {
        //   if (b.code === param.code) {
        //     return {
        //       id: b.id,
        //       code: param.code,
        //       codeChineseName: param.codeChineseName,
        //       rate: param.rate,
        //       description: param.description,
        //     };
        //   } else {
        //     return b;
        //   }
        // });
        // this.setState({ allBpi: allBpi });

        await axios
          .put(updateUrl, this.buildRqData(param))
          .then(res => {
            const {data} = res;
            const bpi = data.data;
            if (data.code === "0000") {
              console.log(data.message);
              allBpi.map(b => {
                if (b.code === bpi.code) {
                  return {
                    id: b.id,
                    code: bpi.code,
                    codeChineseName: bpi.codeChineseName,
                    rate: bpi.rate,
                    description: bpi.description,
                  };
                } else {
                  return b;
                }
              });
              this.setState({ allBpi: allBpi});
            } else {
              const { message } = data;
              alert(message);
            }
          })
          .catch(err => console.log(err));
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
        // this.setState({ allBpi: allBpi.filter(b => b.code !== param.code) });
        await axios
          .delete(deleteUrl, { data: param })
          .then(res => {
            const { data } = res;
            const bpi = data.data;
            if (data.code === "0000") {
              this.setState({
                allBpi: allBpi.filter((b) => b.code !== bpi.code),
              });
            }
          })
          .catch(err => console.log(err));
        break;
      default:
        break;
    }
  }


  render() {

    const columns = [
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
     * 分頁props config
     */
    const paginationProps = {
      defaultCurrent: 1,      // 預設當前頁
      defaultPageSize: 10,    // 預設每頁條數
      showSizeChanger: true,  // 是否展示 pageSize 切换器，当 total > 50 時默認 true
      showQuickJumper: false, // 是否可以快速跳轉至某頁
      showTotal: (total, range) => `共${total}筆`, // total:總筆數 range:每頁顯示幾筆到幾筆
      pageSize: this.state.pageSize,    // 每頁筆數
      total: this.state.allBpi.length,  // 數據總筆數
      // pageSizeOptions: [10, 20, 50, 100], // 指定每頁可以顯示多少筆 預設 [10, 20, 50, 100]
      onChange: (page, pageSize) => {
        console.log(`當前頁碼 : ${page} `);
        console.log(`選項每頁顯示筆數  ${pageSize}`);
        this.setState({ pageSize: pageSize });
      }, // 頁碼或pageSize改變的回調，參數page:當前頁，pageSize 每頁顯示筆數
      // onShowSizeChange: (current, pageSize) => {
      //   //設置每頁顯示數據調數，current表示當前頁，pageSize每頁顯示筆數
      //   this.setState({ pageSize: pageSize });
      // }, // pageSize 變化的callBack
    };

    return (
      <React.Fragment>
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
                maxLength={3}
                onChange={(e) => this.setCode(e.target.value)}
              />
            </Form.Item>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={() => this.select()}
            >
              查詢
            </Button>
          </Form>
        </div>
        <br />
        {/* 將BpiTable抽到同一頁 */}
        <div hidden={this.state.hiddenFlag}>
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
            onOk={() => this.onOk()}
            onCancel={() => this.onCancel()}
          >
            <Form name="paramEditForm" layout="vertical" ref={this.formRef}>
              <Form.Item
                label="幣別"
                name="code"
                rules={[
                  { required: true, message: "請輸入幣別" },
                  {
                    pattern: new RegExp("[a-zA-Z]", "g"),
                    message: "請輸入英文",
                  }, // g 全域搜索
                ]}
                normalize={(value) => value.toUpperCase()} // 自動轉大寫
              >
                <Input placeholder="TWD" maxLength={3} />
              </Form.Item>
              <Form.Item
                label="幣別中文名稱"
                name="codeChineseName"
                rules={[
                  { required: true, message: "請輸入幣別中文名稱" },
                  {
                    pattern: new RegExp("^[\\u4e00-\\u9fa5]*$"),
                    message: "請輸入中文",
                  },
                ]}
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
              columns={columns}
              bordered
              title={() => "幣別資料表"}
              rowKey={(record) => record.id}
              pagination={paginationProps}
            ></Table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BpiIndex;
