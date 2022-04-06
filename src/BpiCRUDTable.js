import React from "react";
import CRUDTable, {
  Fields,
  Field,
  CreateForm,
  UpdateForm,
  DeleteForm,
} from "react-crud-table";
// Component's Base CSS
import "./index.css";

const styles = {
  container: { margin: "auto", width: "fit-content" },
};

let testData = [
  {
    id: 1,
    code: "TWD",
    codeChineseName: "新台幣",
    rate: "12",
    description: "New Taiwan Dollar",
  },
  {
    id: 2,
    code: "USD",
    codeChineseName: "美金",
    rate: "12",
    description: "Unite Dollar",
  },
  {
    id: 3,
    code: "NMD",
    codeChineseName: "xx",
    rate: "12",
    description: "xx",
  },
];

let count = testData.length;

const DescriptionRenderer = ({ field }) => <textarea {...field} />;

const service = {
  fetchItems: (payload) => {
    let result = Array.from(testData);
    result = result.sort(getSorter(payload.sort));
    return Promise.resolve(result);
  },
  create: (data) => {
    count += 1;
    testData.push({
      ...data,
      id: count,
    });
    return Promise.resolve(data);
  },
  update: (data) => {
    const location = testData.find((t) => t.id === data.id);
    location.title = data.title;
    location.description = data.description;
    return Promise.resolve(location);
  },
  delete: (data) => {
    const location = testData.find((t) => t.id === data.id);
    testData = testData.filter((t) => t.id !== location.id);
    return Promise.resolve(location);
  },
};

const SORTERS = {
  NUMBER_ASCENDING: (mapper) => (a, b) => mapper(a) - mapper(b),
  NUMBER_DESCENDING: (mapper) => (a, b) => mapper(b) - mapper(a),
  STRING_ASCENDING: (mapper) => (a, b) => mapper(a).localeCompare(mapper(b)),
  STRING_DESCENDING: (mapper) => (a, b) => mapper(b).localeCompare(mapper(a)),
};

const getSorter = (data) => {
  const mapper = (x) => x[data.field];
  let sorter = SORTERS.STRING_ASCENDING(mapper);

    if (data.field === "id") {
      // data.direction = "ascending"; // 預設升冪
      sorter =
        data.direction === "ascending"
          ? SORTERS.NUMBER_ASCENDING(mapper)
          : SORTERS.NUMBER_DESCENDING(mapper);
    } else {
      sorter =
        data.direction === "ascending"
          ? SORTERS.STRING_ASCENDING(mapper)
          : SORTERS.STRING_DESCENDING(mapper);
    }

  return sorter;
};

class BpiCRUDTable extends React.Component {
  constructor(props) {
    super(props);
    // State: 應用程式狀態
    this.state = {};
  }

  render() {
    return (
      // Bpi CRUD Table
      <div style={styles.container}>
        <CRUDTable
          caption="Bpi"
          fetchItems={(payload) => service.fetchItems(payload)}
        >
          {/* 欄位名稱  */}
          <Fields>
            <Field name="id" label="序號" hideInCreateForm />
            <Field name="code" label="貨幣名稱" />
            <Field name="codeChineseName" label="貨幣中文名稱" />
            <Field name="rate" label="匯率" />
            <Field name="description" label="描述" render={DescriptionRenderer} />
          </Fields>
          <CreateForm
            title="新增幣別"
            trigger="新增"
            submitText="新增"
            validate={(values) => {
              const errors = {};
              if (!values.title) {
                errors.title = "Please, provide location's title";
              }

              if (!values.description) {
                errors.description = "Please, provide location's description";
              }

              return errors;
            }}
            onSubmit={(bpi) => this.addBpi()}
          />
          <UpdateForm
            title="修改幣別"
            trigger="修改"
            onSubmit={(bpi) => service.update(bpi)}
            submitText="修改"
            validate={(values) => {
              const errors = {};

              if (!values.id) {
                errors.id = "Please, provide id";
              }

              if (!values.title) {
                errors.title = "Please, provide location's title";
              }

              if (!values.description) {
                errors.description = "Please, provide location's description";
              }

              return errors;
            }}
          />
          <DeleteForm
            title="刪除幣別"
            message="確定要刪除此幣別?"
            trigger="刪除"
            onSubmit={(bpi) => service.delete(bpi)}
            submitText="確定"
            validate={(values) => {
              const errors = {};
              if (!values.id) {
                errors.id = "Please, provide id";
              }
              return errors;
            }}
          />
        </CRUDTable>
      </div>
    );
  }
}

export default BpiCRUDTable;
