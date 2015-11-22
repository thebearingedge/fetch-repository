'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _slice = Array.prototype.slice;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _qsLibStringify = require('qs/lib/stringify');

var _qsLibStringify2 = _interopRequireDefault(_qsLibStringify);

var FetchApi = (function () {
  function FetchApi(fetch) {
    _classCallCheck(this, FetchApi);

    this.fetch = fetch;
  }

  _createClass(FetchApi, [{
    key: 'format',
    value: function format(body) {
      return JSON.stringify(body);
    }
  }, {
    key: 'onBeforeFetch',
    value: function onBeforeFetch(url, options) {
      return Promise.resolve(arguments);
    }
  }, {
    key: 'onResponse',
    value: function onResponse(res) {
      return Promise.resolve(res.json());
    }
  }, {
    key: 'parse',
    value: function parse(data) {
      return data;
    }
  }, {
    key: 'onRejection',
    value: function onRejection(err) {
      throw err;
    }
  }, {
    key: 'send',
    value: function send(method, path, payload, params) {
      var _this = this;

      var base = this.base;
      var headers = this.headers;

      var url = base || '';
      if (path) url += '/' + path.match(/[^\/]+/g).join('/');
      var queryString = (0, _qsLibStringify2['default'])(params);
      if (queryString) url += '?' + queryString;
      var body = this.format(payload);
      var options = { method: method, body: body, headers: headers };
      return this.onBeforeFetch(url, options).then(function (args) {
        return _this.fetch.apply(_this, _toConsumableArray(args));
      }).then(function (res) {
        return _this.onResponse(res);
      }).then(function (data) {
        return _this.parse(data);
      })['catch'](function (err) {
        return _this.onRejection(err);
      });
    }
  }, {
    key: 'base',
    get: function get() {
      return null;
    }
  }, {
    key: 'headers',
    get: function get() {
      return { 'content-type': 'application/json' };
    }
  }]);

  return FetchApi;
})();

exports['default'] = FetchApi;

var actionMap = {
  read: 'GET',
  create: 'POST',
  replace: 'PUT',
  update: 'PATCH',
  destroy: 'DELETE'
};

Object.keys(actionMap).forEach(function (action) {
  Object.defineProperty(FetchApi.prototype, action, {
    value: function value() {
      var args = [actionMap[action]].concat(_slice.call(arguments));
      return this.send.apply(this, _toConsumableArray(args));
    }
  });
});
module.exports = exports['default'];