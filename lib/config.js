"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getComplexTableConfig = exports.getvalue = exports.mapToData = exports.treeFormatList = void 0;

var _lodash = require("lodash");

var _react = _interopRequireDefault(require("react"));

var _antd = require("antd");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*
 * @Author: wb-yangergang
 * @Date: 2021-05-12 10:41:09
 * @LastEditors: wb-yangergang
 * @LastEditTime: 2021-07-21 17:17:24
 * @Description: file content
 */

/**
 * @description: 树形数据 格式化为 表格数据
 * @param {*} dataSource - 多树形数据
 * @param {*} dataMap - 树形结构
 * @return {*} - 表格数据
 */
var treeFormatList = function treeFormatList() {
  var dataSource = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var dataMap = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'data[].name';
  var data = dataSource.slice(0);
  var mapArr = dataMap.replace(/\[[^.]+]/g, '').split('.');
  mapArr.pop();
  if (mapArr.length < 1) return data;
  data.forEach(function (item) {
    item.rowSpan = formatRowSpan(item[mapArr[1]], mapArr, 2);
  });
  data.forEach(function (item, index) {
    item.itemIndex = index;
    item.baseIndex = index === 0 ? 0 : data[index - 1].baseIndex + data[index - 1].rowSpan;
    formBaseIndex(item[mapArr[1]], mapArr, 2);
  });
  var tempData = [];
  var now = new Date().getTime();
  data.forEach(function (item, index) {
    item.tableRowKey = now - index;
    tempData.push(item);

    if (item.rowSpan === 1 || !item.rowSpan) {
      return;
    }

    for (var i = 0; i < item.rowSpan - 1; i++) {
      tempData.push({});
    }
  });
  return tempData;
};

exports.treeFormatList = treeFormatList;

var formBaseIndex = function formBaseIndex() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var mapArr = arguments.length > 1 ? arguments[1] : undefined;
  var i = arguments.length > 2 ? arguments[2] : undefined;
  data.forEach(function (item, index) {
    item.itemIndex = index;
    item.baseIndex = index === 0 ? 0 : data[index - 1].baseIndex + data[index - 1].rowSpan;

    if (i <= mapArr.length) {
      formBaseIndex(item[mapArr[i]], mapArr, i + 1);
    }
  });
};

var formatRowSpan = function formatRowSpan() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var mapArr = arguments.length > 1 ? arguments[1] : undefined;
  var i = arguments.length > 2 ? arguments[2] : undefined;

  if (i === mapArr.length) {
    data.forEach(function (item) {
      item.rowSpan = 1;
    });
    return getLength(data);
  }

  data.forEach(function (item) {
    item.rowSpan = formatRowSpan(item[mapArr[i]], mapArr, i + 1);
  });
  return data.reduce(function (sum, item) {
    return sum + item.rowSpan;
  }, 0);
};

var getLength = function getLength(data) {
  return Array.isArray(data) ? data.length || 1 : 1;
};
/**
 * @description: 数据结构 转 数据
 * @param {*} field - xxx[0].xxx[0].....name
 * @return {*} - 
 */


var mapToData = function mapToData(field) {
  var mapArr = field.split('.');
  var obj = {};
  mapArr.forEach(function (item, i) {
    if (/\[.+]/g.test(item)) {
      var t = mapArr[i];
      var order = Number(t.slice(t.indexOf('[') + 1, t.indexOf(']')));
      var tempArr = [];

      for (var j = 0; j <= order; j++) {
        tempArr.push({});
      }

      if (i === 0) {
        var path = mapArr[i];
        obj[path.slice(0, path.lastIndexOf('['))] = tempArr;
      } else {
        var _path = mapArr.slice(0, i).join('.');

        _path = _path.slice(0, _path.lastIndexOf('['));
        var temp = mapArr[i];
        temp = temp.slice(0, temp.lastIndexOf('['));
        var cb = (0, _lodash.get)(obj, _path, 'ab');
        var tam = mapArr[i - 1];
        var childOrder = Number(tam.slice(tam.indexOf('[') + 1, tam.indexOf(']')));
        cb[childOrder][temp] = tempArr;
      }
    } else {
      var _path2 = mapArr.slice(0, i).join('.');

      _path2 = _path2.slice(0, _path2.lastIndexOf('['));

      var _cb = (0, _lodash.get)(obj, _path2, 'ab');

      _cb[0][item] = undefined;
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


exports.mapToData = mapToData;

var getvalue = function getvalue() {
  var d = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var j = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var f = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'complex[0].work[0].institutionName';

  var getItemformIndex = function getItemformIndex() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var order = arguments.length > 1 ? arguments[1] : undefined;
    var num = 0;
    var record = data.find(function (item) {
      num = item.itemIndex;
      return order >= item.baseIndex && order < item.baseIndex + item.rowSpan;
    }) || {};
    j -= record.baseIndex || 0;
    return [record, j, num];
  };

  var mapArr = f.replace(/\[[^.]+]/g, '').split('.');
  var c = {};
  c[mapArr[0]] = d;
  var field = [];
  mapArr.forEach(function (item, index) {
    field.push(item);

    if (index === mapArr.length - 1) {
      return c;
    }

    var m = 0;

    var _getItemformIndex = getItemformIndex(c[item], j);

    c = _getItemformIndex[0];
    j = _getItemformIndex[1];
    m = _getItemformIndex[2];
    field[index] += "[".concat(m, "]");
  });
  return [c, !j, field.join('.')];
}; // --------------------------- template -----------------------------


exports.getvalue = getvalue;

var getComplexTableConfig = function getComplexTableConfig() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var getFieldDecorator = params.form.getFieldDecorator,
      _params$field = params.field,
      field = _params$field === void 0 ? 'complex' : _params$field,
      _params$data = params.data,
      data = _params$data === void 0 ? [] : _params$data,
      addRow = params.addRow,
      deleteRow = params.deleteRow;

  var tableInpunt = function tableInpunt(name, text, record, index) {
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, getFieldDecorator(name, {
      initialValue: text,
      rules: [{
        required: true,
        message: '请输入代表姓名'
      }]
    })( /*#__PURE__*/_react["default"].createElement(_antd.Input, {
      placeholder: "\u8BF7\u8F93\u5165"
    })), /*#__PURE__*/_react["default"].createElement(_antd.Icon, {
      onClick: function onClick() {
        return deleteRow(name, index);
      },
      type: "minus-circle-o"
    }), /*#__PURE__*/_react["default"].createElement(_antd.Icon, {
      onClick: function onClick() {
        return addRow(name, index);
      },
      type: "plus-circle-o"
    }));
  };

  return [{
    title: 'name',
    dataIndex: 'name',
    render: function render(t, r, i) {
      var _getvalue = getvalue(data, i, 'complex[0].name'),
          record = _getvalue[0],
          show = _getvalue[1];

      var _record$rowSpan = record.rowSpan,
          rowSpan = _record$rowSpan === void 0 ? 0 : _record$rowSpan;
      return {
        children: show ? tableInpunt("".concat(field, "[").concat(r.itemIndex, "].name"), record.name, record, i) : null,
        props: {
          rowSpan: show ? rowSpan : 0
        }
      };
    }
  }, {
    title: '工作单位',
    dataIndex: 'institutionName',
    render: function render(t, r, i) {
      var _getvalue2 = getvalue(data, i, 'complex[0].work[0].institutionName'),
          record = _getvalue2[0],
          show = _getvalue2[1],
          name = _getvalue2[2];

      var _record$rowSpan2 = record.rowSpan,
          rowSpan = _record$rowSpan2 === void 0 ? 0 : _record$rowSpan2,
          text = record.institutionName;
      return {
        children: show ? tableInpunt(name, text, record, i) : null,
        props: {
          rowSpan: show ? rowSpan : 0
        }
      };
    }
  }, {
    title: '职务/职称',
    dataIndex: 'jobTitle',
    key: 'jobTitle',
    width: 180,
    render: function render(t, r, i) {
      var _getvalue3 = getvalue(data, i, 'complex[0].work[0].jobTitle'),
          record = _getvalue3[0],
          show = _getvalue3[1],
          name = _getvalue3[2];

      var _record$rowSpan3 = record.rowSpan,
          rowSpan = _record$rowSpan3 === void 0 ? 0 : _record$rowSpan3,
          text = record.jobTitle;
      return {
        children: show ? tableInpunt(name, text, record, i) : null,
        props: {
          rowSpan: show ? rowSpan : 0
        }
      };
    }
  }, {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
    width: 180,
    render: function render(t, r, i) {
      var _getvalue4 = getvalue(data, i, 'complex[0].work[0].phone'),
          record = _getvalue4[0],
          show = _getvalue4[1],
          name = _getvalue4[2];

      var _record$rowSpan4 = record.rowSpan,
          rowSpan = _record$rowSpan4 === void 0 ? 0 : _record$rowSpan4,
          text = record.phone;
      return {
        children: show ? tableInpunt(name, text, record, i) : null,
        props: {
          rowSpan: show ? rowSpan : 0
        }
      };
    }
  }, {
    title: 'workmate',
    dataIndex: 'workmate',
    key: 'workmate',
    width: 180,
    render: function render(t, r, i) {
      var _getvalue5 = getvalue(data, i, 'complex[0].work[0].workmates[0].workmate'),
          record = _getvalue5[0],
          show = _getvalue5[1],
          name = _getvalue5[2];

      var _record$rowSpan5 = record.rowSpan,
          rowSpan = _record$rowSpan5 === void 0 ? 0 : _record$rowSpan5,
          text = record.workmate;
      return {
        children: show ? tableInpunt(name, text, record, i) : null,
        props: {
          rowSpan: show ? rowSpan : 0
        }
      };
    }
  }];
};

exports.getComplexTableConfig = getComplexTableConfig;