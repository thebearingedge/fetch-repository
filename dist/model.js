'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = (function () {
  _createClass(Model, null, [{
    key: 'serialize',
    value: function serialize(instance) {
      return JSON.stringify(instance._data);
    }
  }]);

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
    key: 'id',
    get: function get() {
      var idAttribute = this.idAttribute;
      var _data = this._data;

      return _data[idAttribute] || null;
    }
  }]);

  return Model;
})();

exports.default = Model;