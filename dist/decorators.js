'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.findById = findById;
exports.save = save;
exports.list = list;
exports.destroy = destroy;

function findById(Repository) {
  Object.defineProperty(Repository.prototype, 'findById', {
    value: function findById(id) {
      var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var _ref$$returning = _ref.$returning;
      var $returning = _ref$$returning === undefined ? {} : _ref$$returning;

      var method = 'get';
      var path = this.buildPath(id);
      var query = { $returning: $returning };
      return this.sync(method, path, undefined, query);
    }
  });
}

function save(Repository) {
  Object.defineProperty(Repository.prototype, 'save', {
    value: function save(model) {
      var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var _ref2$patch = _ref2.patch;
      var patch = _ref2$patch === undefined ? false : _ref2$patch;
      var _ref2$$returning = _ref2.$returning;
      var $returning = _ref2$$returning === undefined ? {} : _ref2$$returning;
      var id = model.id;

      var body = this.serialize(model);
      var method = id != null ? patch ? 'patch' : 'put' : 'post';
      var path = this.buildPath(id);
      var query = { $returning: $returning };
      return this.sync(method, path, body, query);
    }
  });
}

function list(Repository) {
  Object.defineProperty(Repository.prototype, 'list', {
    value: function list() {
      var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var method = 'get';
      var path = this.buildPath();
      return this.sync(method, path, undefined, query);
    }
  });
}

function destroy(Repository) {
  Object.defineProperty(Repository.prototype, 'destroy', {
    value: function destroy(model) {
      var id = model.id;

      if (id == null) return Promise.resolve(this.create({}));
      var method = 'delete';
      var path = this.buildPath(id);
      return this.sync(method, path);
    }
  });
}