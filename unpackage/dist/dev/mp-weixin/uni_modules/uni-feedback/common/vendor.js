(global["webpackJsonp"] = global["webpackJsonp"] || []).push([["uni_modules/uni-feedback/common/vendor"],{

/***/ 138:
/*!*************************************************************************************************************************!*\
  !*** C:/Users/Administrator/Desktop/知识产权管理小程序/坤灵知识产权管理小程序/uni_modules/uni-feedback/js_sdk/validator/opendb-feedback.js ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _interopRequireDefault = __webpack_require__(/*! @babel/runtime/helpers/interopRequireDefault */ 4);
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enumConverter = void 0;
exports.filterToWhere = filterToWhere;
exports.validator = void 0;
var _slicedToArray2 = _interopRequireDefault(__webpack_require__(/*! @babel/runtime/helpers/slicedToArray */ 5));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }
// 表单校验规则由 schema2code 生成，不建议直接修改校验规则，而建议通过 schema2code 生成, 详情: https://uniapp.dcloud.net.cn/uniCloud/schema

var validator = {
  "content": {
    "rules": [{
      "required": true
    }, {
      "format": "string"
    }],
    "label": "留言内容/回复内容"
  },
  "imgs": {
    "rules": [{
      "format": "array"
    }, {
      "arrayType": "file"
    }, {
      "maxLength": 6
    }],
    "label": "图片列表"
  },
  "contact": {
    "rules": [{
      "format": "string"
    }],
    "label": "联系人"
  },
  "mobile": {
    "rules": [{
      "format": "string"
    }, {
      "pattern": "^\\+?[0-9-]{3,20}$"
    }],
    "label": "联系电话"
  }
};
exports.validator = validator;
var enumConverter = {};
exports.enumConverter = enumConverter;
function filterToWhere(filter, command) {
  var where = {};
  for (var field in filter) {
    var _filter$field = filter[field],
      type = _filter$field.type,
      value = _filter$field.value;
    switch (type) {
      case "search":
        if (typeof value === 'string' && value.length) {
          where[field] = new RegExp(value);
        }
        break;
      case "select":
        if (value.length) {
          var selectValue = [];
          var _iterator = _createForOfIteratorHelper(value),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var s = _step.value;
              selectValue.push(command.eq(s));
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          where[field] = command.or(selectValue);
        }
        break;
      case "range":
        if (value.length) {
          var gt = value[0];
          var lt = value[1];
          where[field] = command.and([command.gte(gt), command.lte(lt)]);
        }
        break;
      case "date":
        if (value.length) {
          var _value = (0, _slicedToArray2.default)(value, 2),
            _s = _value[0],
            e = _value[1];
          var startDate = new Date(_s);
          var endDate = new Date(e);
          where[field] = command.and([command.gte(startDate), command.lte(endDate)]);
        }
        break;
      case "timestamp":
        if (value.length) {
          var _value2 = (0, _slicedToArray2.default)(value, 2),
            _startDate = _value2[0],
            _endDate = _value2[1];
          where[field] = command.and([command.gte(_startDate), command.lte(_endDate)]);
        }
        break;
    }
  }
  return where;
}

/***/ })

}]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/uni_modules/uni-feedback/common/vendor.js.map