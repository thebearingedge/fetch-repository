'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Model = (function () {
  function Model() {
    var json = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Model);

    this._json = json;
  }

  _createClass(Model, [{
    key: 'idAttribute',
    get: function get() {
      return 'id';
    }
  }, {
    key: 'id',
    get: function get() {
      return this._json[this.idAttribute] || null;
    }
  }, {
    key: 'json',
    get: function get() {
      return this._json;
    }
  }]);

  return Model;
})();

exports['default'] = Model;
module.exports = exports['default'];