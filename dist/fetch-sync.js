'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _slice = Array.prototype.slice;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var FetchSync = (function () {
  function FetchSync(fetch) {
    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var base = _ref.base;
    var headers = _ref.headers;

    _classCallCheck(this, FetchSync);

    if (!base || base === '/') {
      this.base = null;
    } else if (base.endsWith('/')) {
      this.base = base.slice(0, base.length - 1);
    } else {
      this.base = base;
    }
    this.fetch = fetch;
    this.headers = headers;
  }

  _createClass(FetchSync, [{
    key: 'parseQuery',
    value: function parseQuery() {}
  }, {
    key: 'parseResponse',
    value: function parseResponse(res) {
      return res.json();
    }
  }, {
    key: 'parseBody',
    value: function parseBody(body) {
      return JSON.stringify(body);
    }
  }, {
    key: 'onBeforeSend',
    value: function onBeforeSend(url, options) {
      return [url, options];
    }
  }, {
    key: 'onRejection',
    value: function onRejection(err) {
      throw err;
    }
  }, {
    key: 'send',
    value: function send(method, path, body, params, _headers) {
      var _this = this;

      var base = this.base;
      var headers = this.headers;

      var url = base || '';
      if (path) url += '/' + path.match(/[^\/]+/g).join('/');
      var queryString = this.parseQuery(params);
      if (queryString) url += '?' + queryString;
      var options = {
        method: method,
        headers: Object.assign({}, headers, _headers),
        body: this.parseBody(body)
      };
      return Promise.resolve(this.onBeforeSend(url, options)).then(function (args) {
        return _this.fetch.apply(_this, _toConsumableArray(args));
      }).then(function (res) {
        return _this.parseResponse(res);
      })['catch'](function (err) {
        return _this.onRejection(err);
      });
    }
  }]);

  return FetchSync;
})();

exports['default'] = FetchSync;

var actionMap = {
  read: 'GET',
  create: 'POST',
  replace: 'PUT',
  update: 'PATCH',
  destroy: 'DELETE'
};

Object.keys(actionMap).forEach(function (action) {
  Object.defineProperty(FetchSync.prototype, action, {
    value: function value() {
      var args = [actionMap[action]].concat(_slice.call(arguments));
      return this.send.apply(this, _toConsumableArray(args));
    }
  });
});
module.exports = exports['default'];