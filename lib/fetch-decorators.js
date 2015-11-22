'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var _slice = Array.prototype.slice;
exports.findable = findable;
exports.listable = listable;
exports.searchable = searchable;
exports.saveable = saveable;
exports.destroyable = destroyable;

function findable(Repository) {
  addMethod(Repository, 'find', function () {
    var _this = this;

    return find.call.apply(find, [this].concat(_slice.call(arguments))).then(function (data) {
      return _this.create(data);
    });
  });
  addMethod(Repository, 'loadFind', loadFind);
}

function listable(Repository) {
  addMethod(Repository, 'list', function () {
    var _this2 = this;

    return list.call.apply(list, [this].concat(_slice.call(arguments))).then(function (data) {
      return _this2.create(data);
    });
  });
  addMethod(Repository, 'loadList', loadList);
}

function searchable(Repository) {
  addMethod(Repository, 'search', function () {
    var _this3 = this;

    return search.call.apply(search, [this].concat(_slice.call(arguments))).then(function (data) {
      return _this3.create(data);
    });
  });
  addMethod(Repository, 'loadSearch', loadSearch);
}

function saveable(Repository) {
  addMethod(Repository, 'save', function () {
    var _this4 = this;

    return save.call.apply(save, [this].concat(_slice.call(arguments))).then(function (data) {
      return _this4.create(data);
    });
  });
}

function destroyable(Repository) {
  addMethod(Repository, 'destroy', destroy);
}

function find(id) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  var _ref = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var _ref$cache = _ref.cache;
  var cache = _ref$cache === undefined ? false : _ref$cache;

  var action = 'read';
  var path = buildPath.call(this, id);
  return this.sync(action, path, null, params, { cache: cache });
}

function loadFind() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return load.call.apply(load, [this, 'find'].concat(args));
}

function list(where) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref2 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var _ref2$cache = _ref2.cache;
  var cache = _ref2$cache === undefined ? false : _ref2$cache;

  var action = 'read';
  var path = buildPath.call(this);
  params.$where = where;
  return this.sync(action, path, null, params, { cache: cache });
}

function loadList() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return load.call.apply(load, [this, 'list'].concat(args));
}

function search(text) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var _ref3 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var _ref3$cache = _ref3.cache;
  var cache = _ref3$cache === undefined ? false : _ref3$cache;

  var action = 'read';
  var path = buildPath.call(this);
  params.$search = text;
  return this.sync(action, path, null, params, { cache: cache });
}

function loadSearch() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return load.call.apply(load, [this, 'search'].concat(args));
}

function save(model) {
  var _this5 = this;

  var params = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

  var _ref4 = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var _ref4$replace = _ref4.replace;
  var replace = _ref4$replace === undefined ? false : _ref4$replace;
  var _ref4$cache = _ref4.cache;
  var cache = _ref4$cache === undefined ? false : _ref4$cache;

  var isCollection = Array.isArray(model);
  var action = undefined,
      payload = undefined,
      id = undefined;
  if (isCollection) {
    action = replace ? 'replace' : 'update';
    payload = model.map(function (instance) {
      return _this5.serialize(instance);
    });
  } else {
    id = model.id;
    action = id ? replace ? 'replace' : 'update' : 'create';
    payload = this.serialize(model);
  }
  var path = buildPath.call(this, model.id);
  return this.sync(action, path, payload, params, { cache: cache });
}

function destroy(model) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var isCollection = Array.isArray(model);
  var models = isCollection ? model : [model];
  var toSync = models.filter(function (model) {
    return !!model.id;
  });
  var promise = undefined;
  if (!toSync.length) {
    this.clear();
    promise = Promise.resolve();
  } else if (isCollection) {
    params.$destroy = true;
    promise = save.call(this, toSync, params);
  } else {
    var action = 'destroy';
    var path = buildPath.call(this, model.id);
    promise = this.sync(action, path, null, params);
  }
  return promise.then(function () {
    return models.forEach(function (model) {
      return model._data = null;
    });
  });
}

function addMethod(Class, prop, fn) {
  Object.defineProperty(Class.prototype, prop, { value: fn });
}

function buildPath(id) {
  var path = this.collection || '';
  if (id) path += '/' + id;
  return path;
}

function load(query, criteria, params) {
  var _this6 = this;

  return this[query](criteria, params, { cache: true }).then(function () {
    return _this6;
  });
}