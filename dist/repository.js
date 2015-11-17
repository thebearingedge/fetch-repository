'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Repository = (function () {
  function Repository(api, Model) {
    _classCallCheck(this, Repository);

    this.api = api;
    this.Model = Model;
  }

  _createClass(Repository, [{
    key: 'create',
    value: function create(json) {
      var _this = this;

      return Array.isArray(json) ? json.map(function (record) {
        return new _this.Model(record);
      }) : new this.Model(json);
    }
  }, {
    key: 'buildPath',
    value: function buildPath(id) {
      var resource = this.resource;

      return [resource, id].filter(function (path) {
        return !!path;
      }).join('/');
    }
  }, {
    key: 'serialize',
    value: function serialize(model) {
      return model.json;
    }
  }, {
    key: 'sync',
    value: function sync(method) {
      var _api,
          _this2 = this;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return (_api = this.api)[method].apply(_api, args).then(function (json) {
        return json ? _this2.create(json) : undefined;
      });
    }
  }, {
    key: 'resource',
    get: function get() {
      return this.path != null ? this.path.match(/[^\/]+/g).join('/') : '';
    }
  }]);

  return Repository;
})();

exports['default'] = Repository;
module.exports = exports['default'];