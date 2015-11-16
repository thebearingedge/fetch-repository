'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Repository = (function () {
  function Repository(api, Model) {
    _classCallCheck(this, Repository);

    this.resource = null;
    this.api = api;
    this.Model = Model;
  }

  _createClass(Repository, [{
    key: 'create',
    value: function create() {
      var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      var Model = this.Model;

      return Array.isArray(data) ? data.map(function (record) {
        return new Model(record);
      }) : new Model(data);
    }
  }, {
    key: 'findById',
    value: function findById(id) {
      var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var _ref$$returning = _ref.$returning;
      var $returning = _ref$$returning === undefined ? {} : _ref$$returning;
      var url = this.url;

      var method = 'get';
      var path = url + '/' + id;
      var query = { $returning: $returning };
      return this.sync(path, method, undefined, query);
    }
  }, {
    key: 'sync',
    value: function sync(method, path, payload) {
      var _this = this;

      var query = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

      return this.api[method](path, payload, query).then(function (data) {
        return _this.create(data);
      });
    }
  }, {
    key: 'url',
    get: function get() {
      return this.resource || '';
    }
  }]);

  return Repository;
})();

exports.default = Repository;