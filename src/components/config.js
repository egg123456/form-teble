/*
 * @Author: wb-yangergang
 * @Date: 2021-05-12 10:41:09
 * @LastEditors: wb-yangergang
 * @LastEditTime: 2021-07-21 17:17:24
 * @Description: file content
 */
import { get } from 'lodash';

/**
 * @description: 树形数据 格式化为 表格数据
 * @param {*} dataSource - 多树形数据
 * @param {*} dataMap - 树形结构
 * @return {*} - 表格数据
 */
export const treeFormatList = (dataSource = [], dataMap = 'data[].name') => {
  const data = dataSource.slice(0);
  const mapArr = dataMap.replace(/\[[^.]+]/g, '').split('.');
  mapArr.pop();
  if (mapArr.length < 1) return data;
  data.forEach((item) => {
    item.rowSpan = formatRowSpan(item[mapArr[1]], mapArr, 2);
  });
  data.forEach((item, index) => {
    item.itemIndex = index;
    item.baseIndex = index === 0 ? 0 : data[index - 1].baseIndex + data[index - 1].rowSpan;
    formBaseIndex(item[mapArr[1]], mapArr, 2);
  });
  const tempData = [];
  const now = new Date().getTime();
  data.forEach((item, index) => {
    item.tableRowKey = now - index;
    tempData.push(item);
    if (item.rowSpan === 1 || !item.rowSpan) {
      return;
    }
    for (let i = 0; i < item.rowSpan - 1; i++) {
      tempData.push({});
    }
  });
  return tempData;
};

const formBaseIndex = (data = [], mapArr, i) => {
  data.forEach((item, index) => {
    item.itemIndex = index;
    item.baseIndex = index === 0 ? 0 : data[index - 1].baseIndex + data[index - 1].rowSpan;
    if (i <= mapArr.length) {
      formBaseIndex(item[mapArr[i]], mapArr, i + 1);
    }
  });
};

const formatRowSpan = (data = [], mapArr, i) => {
  if (i === mapArr.length) {
    data.forEach(item => { item.rowSpan = 1; });
    return getLength(data);
  } 
  data.forEach(item => {
    item.rowSpan = formatRowSpan(item[mapArr[i]], mapArr, i + 1);
  });
  return data.reduce((sum, item) => {
    return sum + item.rowSpan;
  }, 0);
};

const getLength = (data) => {
  return Array.isArray(data) ? data.length || 1 : 1;
};

/**
 * @description: 数据结构 转 数据
 * @param {*} field - xxx[0].xxx[0].....name
 * @return {*} - 
 */
export const mapToData = (field) => {
  const mapArr = field.split('.');
  const obj = {};
  mapArr.forEach((item, i) => {
    if (/\[.+]/g.test(item)) {
      const t = mapArr[i];
      const order = Number(t.slice(t.indexOf('[') + 1, t.indexOf(']')));
      const tempArr = [];
      for (let j = 0; j <= order; j++) {
        tempArr.push({});
      }
      if (i === 0) {
        const path = mapArr[i];
        obj[path.slice(0, path.lastIndexOf('['))] = tempArr;
      } else {
        let path = mapArr.slice(0, i).join('.');
        path = path.slice(0, path.lastIndexOf('['));
        let temp = mapArr[i];
        temp = temp.slice(0, temp.lastIndexOf('['));
        const cb = get(obj, path, 'ab');
        const tam = mapArr[i - 1];
        const childOrder = Number(tam.slice(tam.indexOf('[') + 1, tam.indexOf(']')));
        cb[childOrder][temp] = tempArr;
      }
    } else {
      let path = mapArr.slice(0, i).join('.');
      path = path.slice(0, path.lastIndexOf('['));
      const cb = get(obj, path, 'ab');
      cb[0][item] = undefined;
    }
  });
  return obj;
};

/**
 * @description: 通过表格行顺序 以及 表格对应字段层级 拿到 当前顺序下的此单元格是是否展示、展示数据、表单field字段
 * @param {*} d - 表格数据
 * @param {*} j - 当前的表格顺序
 * @param {*} f - 当前的单元格 字段层级
 * @return {*} - 当前单元格的展示数据、是否显示、对应的表单字段
 */
export const getvalue = (d = [], j = 1, f = 'complex[0].work[0].institutionName') => {
  const getItemformIndex = (data = [], order) => {
    let num = 0;
    const record = data.find((item) => {
      num = item.itemIndex;
      return order >= item.baseIndex && order < item.baseIndex + item.rowSpan;
    }) || {};
    j -= (record.baseIndex || 0);
    return [record, j, num];
  };
  const mapArr = f.replace(/\[[^.]+]/g, '').split('.');
  let c = {};
  c[mapArr[0]] = d;
  const field = [];
  mapArr.forEach((item, index) => {
    field.push(item);
    if (index === mapArr.length - 1) {
      return c;
    }
    let m = 0;
    [c, j, m] = getItemformIndex(c[item], j);
    field[index] += `[${m}]`;
  });
  return [c, !j, field.join('.')];
};

// --------------------------- template -----------------------------
import React from 'react';
import { Input, Icon } from 'antd';

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
      <>
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
      </>
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
