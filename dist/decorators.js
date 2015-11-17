'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.findable = findable;
exports.saveable = saveable;
exports.searchable = searchable;
exports.destroyable = destroyable;

function findable(Repository) {
  Object.defineProperty(Repository.prototype, 'find', {
    value: function find(id, query) {
      var method = 'get';
      var path = this.buildPath(id);
      return this.sync(method, path, undefined, query);
    }
  });
}

function saveable(Repository) {
  Object.defineProperty(Repository.prototype, 'save', {
    value: function save(model, query) {
      var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var _ref$patch = _ref.patch;
      var patch = _ref$patch === undefined ? false : _ref$patch;
      var id = model.id;

      var body = this.serialize(model);
      var method = id ? patch ? 'patch' : 'put' : 'post';
      var path = this.buildPath(id);
      return this.sync(method, path, body, query);
    }
  });
}

function searchable(Repository) {
  Object.defineProperty(Repository.prototype, 'search', {
    value: function search(query) {
      var method = 'get';
      var path = this.buildPath();
      return this.sync(method, path, undefined, query);
    }
  });
}

function destroyable(Repository) {
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