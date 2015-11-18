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
    value: function find(id, params) {
      var action = 'fetch';
      var path = this.buildPath(id);
      return this.sync(action, path, undefined, params);
    }
  });
}

function saveable(Repository) {
  Object.defineProperty(Repository.prototype, 'save', {
    value: function save(model, params) {
      var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var _ref$replace = _ref.replace;
      var replace = _ref$replace === undefined ? false : _ref$replace;

      var body = this.serialize(model);
      var action = model.id ? replace ? 'replace' : 'update' : 'create';
      var path = this.buildPath(model.id);
      return this.sync(action, path, body, params);
    }
  });
}

function searchable(Repository) {
  Object.defineProperty(Repository.prototype, 'search', {
    value: function search(params) {
      var action = 'fetch';
      var path = this.buildPath();
      return this.sync(action, path, undefined, params);
    }
  });
}

function destroyable(Repository) {
  Object.defineProperty(Repository.prototype, 'destroy', {
    value: function destroy(model) {
      if (!model.id) return Promise.resolve(this.create({}));
      var action = 'destroy';
      var path = this.buildPath(model.id);
      return this.sync(action, path);
    }
  });
}