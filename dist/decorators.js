'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.persistable = persistable;
exports.searchable = searchable;
exports.listable = listable;
exports.destroyable = destroyable;
function persistable(target) {
  Object.defineProperty(target.prototype, 'save', {
    value: save
  });
}

function save(instance) {
  var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref$patch = _ref.patch;
  var patch = _ref$patch === undefined ? false : _ref$patch;
  var _ref$$returning = _ref.$returning;
  var $returning = _ref$$returning === undefined ? {} : _ref$$returning;
  var url = this.url;
  var Model = this.Model;
  var id = instance.id;

  var method = id ? patch ? 'patch' : 'put' : 'post';
  var path = method === 'post' ? url : url + '/' + id;
  var payload = Model.serialize(instance);
  var query = { $returning: $returning };
  return this.sync(path, method, payload, query);
}

function searchable(target) {
  Object.defineProperty(target.prototype, 'search', {
    value: search
  });
}

function search() {
  var _ref2 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref2$$search = _ref2.$search;
  var $search = _ref2$$search === undefined ? '' : _ref2$$search;
  var _ref2$$returning = _ref2.$returning;
  var $returning = _ref2$$returning === undefined ? {} : _ref2$$returning;

  var method = 'get';
  var path = this.url;
  var query = { $search: $search, $returning: $returning };
  return this.sync(path, method, undefined, query);
}

function listable(target) {
  Object.defineProperty(target.prototype, 'list', {
    value: list
  });
}

function list(_ref3) {
  var _ref3$$params = _ref3.$params;
  var $params = _ref3$$params === undefined ? {} : _ref3$$params;
  var _ref3$$relations = _ref3.$relations;
  var $relations = _ref3$$relations === undefined ? [] : _ref3$$relations;

  var method = 'get';
  var path = this.url;
  var query = { $params: $params, $relations: $relations };
  return this.sync(path, method, undefined, query);
}

function destroyable(target) {
  Object.defineProperty(target.prototype, 'destroy', {
    value: destroy
  });
}

function destroy(model) {
  var url = this.url;
  var id = model.id;

  var method = 'delete';
  var path = url + '/' + id;
  return this.sync(path, method);
}