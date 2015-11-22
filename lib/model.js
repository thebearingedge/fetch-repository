'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _deepClone = require('deep-clone');

var _deepClone2 = _interopRequireDefault(_deepClone);

var Model = (function () {
  function Model() {
    var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Model);

    this._data = data;
  }

  _createClass(Model, [{
    key: 'idAttribute',
    get: function get() {
      return 'id';
    }
  }, {
    key: 'data',
    get: function get() {
      return (0, _deepClone2['default'])(this._data);
    }
  }, {
    key: 'id',
    get: function get() {
      return this._data[this.idAttribute] || null;
    }
  }]);

  return Model;
})();

exports['default'] = Model;
module.exports = exports['default'];