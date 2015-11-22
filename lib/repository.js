'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _deepClone = require('deep-clone');

var _deepClone2 = _interopRequireDefault(_deepClone);

var _model = require('./model');

var _model2 = _interopRequireDefault(_model);

var Repository = (function () {
  function Repository(api) {
    _classCallCheck(this, Repository);

    this.api = api;
  }

  _createClass(Repository, [{
    key: 'clear',
    value: function clear() {
      delete this._cache;
    }
  }, {
    key: 'create',
    value: function create(_data) {
      var _this = this;

      var data = (0, _deepClone2['default'])(_data);
      return Array.isArray(data) ? data.map(function (datum) {
        return new _this.Model(datum);
      }) : new this.Model(data);
    }
  }, {
    key: 'serialize',
    value: function serialize(model) {
      return model.data;
    }
  }, {
    key: 'sync',
    value: function sync(action, resource, payload, params) {
      var _this2 = this;

      var _ref = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];

      var _ref$cache = _ref.cache;
      var cache = _ref$cache === undefined ? false : _ref$cache;

      return this.api[action](resource, payload, params).then(function (data) {
        _this2.clear();
        if (!data) return;
        if (cache) _this2._cache = (0, _deepClone2['default'])(data);
        return data;
      });
    }
  }, {
    key: 'collection',
    get: function get() {
      return null;
    }
  }, {
    key: 'Model',
    get: function get() {
      return _model2['default'];
    }
  }, {
    key: 'cache',
    get: function get() {
      var _cache = this._cache;

      return _cache ? this.create(_cache) : null;
    }
  }]);

  return Repository;
})();

exports['default'] = Repository;
module.exports = exports['default'];