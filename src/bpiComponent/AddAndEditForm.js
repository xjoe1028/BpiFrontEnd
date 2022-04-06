import { Form, Input, Modal } from "antd";
import "antd/dist/antd.css";
import TextArea from "antd/lib/input/TextArea";
import React from "react";

/**
 * 新增 和 編輯 頁面
 * 
 * @param {*} visible 
 * @param {*} item 
 * @param {*} onCreate 
 * @param {*} onCancel 
 * @param {*} handleChange 
 * @returns 
 */
 export default function AddAndEditForm({visible, item, onCreate, onCancel, handleChange}){
    const title = item.id ? "編輯幣別" : "新增幣別";
    const okText = item.id ? "編輯" : "新增";
    const [form] = Form.useForm();
    return (
      <Modal
        visible={visible}
        title={title}
        okText={okText}
        cancelText="取消"
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        onCancel={onCancel}
      >
        <Form name="bpiEditForm" layout="vertical" form={form}>
          <Form.Item
            label="幣別"
            name="code"
            rules={[{ required: true, message: "請輸入幣別" }]}
          >
            <Input
              value={item.code || ""}
              placeholder="TWD"
              maxLength={3}
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            label="幣別中文名稱"
            name="codeChineseName"
            rules={[{ required: true, message: "請輸入幣別中文名稱" }]}
          >
            <Input
              value={item.codeChineseName || ""}
              placeholder="新台幣"
              onChange={handleChange}
            />
          </Form.Item>
          <Form.Item
            label="利率"
            name="rate"
            rules={[{ required: true, message: "請輸入利率" }]}
          >
            <Input value={item.rate || ""} onChange={handleChange} />
            {/* <InputNumber value={item.rate || ""} onChange={handleChange} defaultValue={0}/> */}
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            rules={[{ required: false, message: "請輸入描述" }]}
          >
            <TextArea
              value={item.description || ""}
              onChange={handleChange}
              maxLength={200}
              rows={5}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  };
