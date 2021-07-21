import React, { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import { cloneDeep, get } from 'lodash';
import { treeFormatList, mapToData, getvalue } from './config';

const FormTable = (props) => {
  const { columns, dataSource = [], form, dataMap = 'data[0].name' } = props;
  const { getFieldsValue, resetFields } = form;
  const [data, setData] = useState([]);

  useEffect(() => {
    const backup = treeFormatList(cloneDeep(dataSource), dataMap) || [];
    // cloneDeep 解决 （当使用两个及以上此组件时 使用了相同的 dataSource）
    setData(cloneDeep(backup));
  }, [dataSource, dataMap]);

  const addRecordHandle = (field) => {
    const capital = field.slice(0, field.indexOf('[')); // 表单中代表 table 数据的字段
    const parent = field.slice(0, field.lastIndexOf('[')); // 当前操作行的 父级 路径
    const currField = field.slice(field.lastIndexOf('.') + 1);
    const i = Number(field[field.lastIndexOf('[') + 1]); // 当前操作行在 父级 中的序号
    const values = getFieldsValue(); // 所有表单值
    const d = get(values, parent, []); // 当前操作行的 父级 数据
    const path = parent.replace(/\[[^.]]/g, '[0]');
    const tempData = mapToData(dataMap);
    const temp = get(tempData, path, [{}])[0];
    temp[currField] = undefined;
    console.log(field, getFieldsValue(), temp, d, 'field');
    d.splice(i + 1, 0, temp); // 父级数据 插入一条数据
    const backup = treeFormatList(cloneDeep(values[capital]), dataMap) || [];
    setData(cloneDeep(backup));
    resetFields([capital]);
  };

  const deleteRow = (field) => {
    const capital = field.slice(0, field.indexOf('[')); // 表单中代表 table 数据的字段
    const parent = field.slice(0, field.lastIndexOf('[')); // 当前操作行的 父级 路径
    const i = Number(field[field.lastIndexOf('[') + 1]); // 当前操作行在 父级 中的序号
    const values = getFieldsValue(); // 所有表单值
    const d = get(values, parent, []); // 当前操作行的 父级 数据
    if (d.length === 1) {
      message.warn('至少有一条记录');
      return;
    }
    d.splice(i, 1); // 父级数据 删除 当前操作行
    const backup = treeFormatList(cloneDeep(values[capital]), dataMap) || [];
    setData(cloneDeep(backup));
    resetFields([capital]);
  };

  return (
    <Table 
      rowKey="tableRowKey"
      columns={columns(data, addRecordHandle, deleteRow)}
      dataSource={data}
      pagination={false}
      bordered={true}
    />
  );
};

FormTable.getvalue = getvalue;

export default FormTable;