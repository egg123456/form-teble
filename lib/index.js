"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _antd = require("antd");

var _lodash = require("lodash");

var _config = require("./config");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var FormTable = function FormTable(props) {
  var columns = props.columns,
      _props$dataSource = props.dataSource,
      dataSource = _props$dataSource === void 0 ? [] : _props$dataSource,
      form = props.form,
      _props$dataMap = props.dataMap,
      dataMap = _props$dataMap === void 0 ? 'data[0].name' : _props$dataMap;
  var getFieldsValue = form.getFieldsValue,
      resetFields = form.resetFields;

  var _useState = (0, _react.useState)([]),
      data = _useState[0],
      setData = _useState[1];

  (0, _react.useEffect)(function () {
    var backup = (0, _config.treeFormatList)((0, _lodash.cloneDeep)(dataSource), dataMap) || []; // cloneDeep ?????? ??????????????????????????????????????? ?????????????????? dataSource???

    setData((0, _lodash.cloneDeep)(backup));
  }, [dataSource, dataMap]);

  var addRecordHandle = function addRecordHandle(field) {
    var capital = field.slice(0, field.indexOf('[')); // ??????????????? table ???????????????

    var parent = field.slice(0, field.lastIndexOf('[')); // ?????????????????? ?????? ??????

    var currField = field.slice(field.lastIndexOf('.') + 1);
    var i = Number(field[field.lastIndexOf('[') + 1]); // ?????????????????? ?????? ????????????

    var values = getFieldsValue(); // ???????????????

    var d = (0, _lodash.get)(values, parent, []); // ?????????????????? ?????? ??????

    var path = parent.replace(/\[[^.]]/g, '[0]');
    var tempData = (0, _config.mapToData)(dataMap);
    var temp = (0, _lodash.get)(tempData, path, [{}])[0];
    temp[currField] = undefined;
    console.log(field, getFieldsValue(), temp, d, 'field');
    d.splice(i + 1, 0, temp); // ???????????? ??????????????????

    var backup = (0, _config.treeFormatList)((0, _lodash.cloneDeep)(values[capital]), dataMap) || [];
    setData((0, _lodash.cloneDeep)(backup));
    resetFields([capital]);
  };

  var deleteRow = function deleteRow(field) {
    var capital = field.slice(0, field.indexOf('[')); // ??????????????? table ???????????????

    var parent = field.slice(0, field.lastIndexOf('[')); // ?????????????????? ?????? ??????

    var i = Number(field[field.lastIndexOf('[') + 1]); // ?????????????????? ?????? ????????????

    var values = getFieldsValue(); // ???????????????

    var d = (0, _lodash.get)(values, parent, []); // ?????????????????? ?????? ??????

    if (d.length === 1) {
      _antd.message.warn('?????????????????????');

      return;
    }

    d.splice(i, 1); // ???????????? ?????? ???????????????

    var backup = (0, _config.treeFormatList)((0, _lodash.cloneDeep)(values[capital]), dataMap) || [];
    setData((0, _lodash.cloneDeep)(backup));
    resetFields([capital]);
  };

  return /*#__PURE__*/_react["default"].createElement(_antd.Table, {
    rowKey: "tableRowKey",
    columns: columns(data, addRecordHandle, deleteRow),
    dataSource: data,
    pagination: false,
    bordered: true
  });
};

FormTable.getvalue = _config.getvalue;
var _default = FormTable;
exports["default"] = _default;