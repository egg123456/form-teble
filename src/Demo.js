/*
 * @Author: wb-yangergang
 * @Date: 2021-07-21 11:36:18
 * @LastEditors: wb-yangergang
 * @LastEditTime: 2021-07-21 17:21:31
 * @Description: file content
 */
import React from 'react';
import ComplexTable from './components';
import { Form, Input, Icon, Button, message } from 'antd';
import 'antd/dist/antd.css';
const getvalue = ComplexTable.getvalue;
const FormItem = Form.Item;

const complexData = [
  { 
    id: 1, 
    name: 'yeg', 
    work: [
      { workmates: [{ workmate: 'cc' }], institutionName: 'web', jobTitle: 'frontend', phone: '133' },
    ],
  },
  { 
    id: 2, 
    name: 'egg', 
    work: [
      { 
        institutionName: 'dt',
        jobTitle: 'frontend', 
        phone: '133',
        workmates: [
          { workmate: 'a' },
          { workmate: 'b' },
          { workmate: 'c' },
        ],
      },
      { workmates: [{ workmate: 'd' }], institutionName: 'bqs', jobTitle: 'frontend', phone: '133' },
      { workmates: [{ workmate: 'e' }], institutionName: 'zcy', jobTitle: 'frontend', phone: '133' },
    ],
  },
  { 
    id: 3, 
    name: 'yw', 
    work: [
      { workmates: [{ }], institutionName: 'web', jobTitle: 'frontend', phone: '133' },
    ],
  },
];

const Demo = (props) => {
  const { form } = props;

  const save = (type = true) => {
    console.log(form.getFieldsValue(), 'form data');
    if (type) {
      const e = form.getFieldsError();
      if (checkingError(e)) return;
      message.info('save success');
      return;
    } 
    form.validateFields(err => {
      if (err) return;
      message.info('submit success');
    });
  };
  
  console.log('egg love')
  return (
    <div style={{ padding: 10 }}>
    <Button onClick={() => save()}>save</Button>
    <Button type="primary" onClick={() => save(false)}>submit</Button>
    <ComplexTable 
      form={form}
      dataSource={complexData}
      columns={(data, addRow, deleteRow) => getComplexTableConfig({
        form,
        data,
        addRow,
        deleteRow,
      })}
      dataMap="complex[0].work[0].workmates[0].workmate"
    />
    </div>
  )
}

export default Form.create()(Demo);

// --------------------- form 字段 准确性 校验 --------------------
/**
 * @description: form 表单 当前已触发的 校验 检测（分为 required and format 校验）
 * @param {*} err - form.getFieldsError()
 * @param {*} type - 错误类型 - 默认 格式-format 校验
 * @return {bool} 是否有该错误类型触发
 */
 export const checkingError = (e = {}, type = 'format') => {
  let has = false;
  const onArr = ['请输入11位号码', '请输入正整数'];
  const hasErr = (err) => {
    const reg = /^请输入|^请选择/;
    if (err instanceof Object) {
      Object.keys(err).some(item => {
        const temp = err[item];
        if (Array.isArray(temp)) {
          if (temp[0] instanceof Object) {
            temp.forEach(i => {
              hasErr(i);
            });
            return;
          } 
          temp.some(el => { 
            if (!el) return;
            if (type === 'format') {
              has = onArr.includes(el) || !reg.test(el);
              return has;
            }
            has = reg.test(el) && !onArr.includes(el); 
            return has;
          });
          return has;
        } else if (temp instanceof Object) { 
          hasErr(temp);
        }
      });
    }
    return has;
  };
  return hasErr(e);
};

export const getComplexTableConfig = (params = {}) => {
  const { 
    form: { getFieldDecorator },
    field = 'complex',
    data = [],
    addRow,
    deleteRow,
  } = params;

  const tableInpunt = (name, text, record, index) => {
    return (
      <FormItem>
        {getFieldDecorator(name, {
          initialValue: text, 
          rules: [{ required: true, message: '请输入代表姓名' }],
        })(
          <Input placeholder="请输入" />
        )}
        <Icon 
          onClick={() => deleteRow(name, index)}
          type="minus-circle-o"
        />
        <Icon 
          onClick={() => addRow(name, index)}
          type="plus-circle-o"
        />
      </FormItem>
    );
  };

  return [
    {
      title: 'name',
      dataIndex: 'name',
      render: (t, r, i) => {
        const [record, show] = getvalue(data, i, 'complex[0].name');
        const { rowSpan = 0 } = record;
        return {
          children: show ? tableInpunt(`${field}[${r.itemIndex}].name`, record.name, record, i) : null,
          props: {
            rowSpan: show ? rowSpan : 0,
          },
        };
      },
    },
    {
      title: '工作单位',
      dataIndex: 'institutionName',
      render: (t, r, i) => {
        const [record, show, name] = getvalue(data, i, 'complex[0].work[0].institutionName');
        const { rowSpan = 0, institutionName: text } = record;
        return {
          children: show ? tableInpunt(name, text, record, i) : null,
          props: {
            rowSpan: show ? rowSpan : 0,
          },
        };
      },
    },
    {
      title: '职务/职称',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      width: 180,
      render: (t, r, i) => {
        const [record, show, name] = getvalue(data, i, 'complex[0].work[0].jobTitle');
        const { rowSpan = 0, jobTitle: text } = record;
        return {
          children: show ? tableInpunt(name, text, record, i) : null,
          props: {
            rowSpan: show ? rowSpan : 0,
          },
        };
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 180,
      render: (t, r, i) => {
        const [record, show, name] = getvalue(data, i, 'complex[0].work[0].phone');
        const { rowSpan = 0, phone: text } = record;
        return {
          children: show ? tableInpunt(name, text, record, i) : null,
          props: {
            rowSpan: show ? rowSpan : 0,
          },
        };
      },
    },
    {
      title: 'workmate',
      dataIndex: 'workmate',
      key: 'workmate',
      width: 180,
      render: (t, r, i) => {
        const [record, show, name] = getvalue(data, i, 'complex[0].work[0].workmates[0].workmate');
        const { rowSpan = 0, workmate: text } = record;
        return {
          children: show ? tableInpunt(name, text, record, i) : null,
          props: {
            rowSpan: show ? rowSpan : 0,
          },
        };
      },
    },
  ];
};
