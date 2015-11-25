
export function findable(Repository) {
  decorate(Repository, 'find', function () {
    return find
      .call(this, ...arguments)
      .then(data => this.create(data))
  })
  decorate(Repository, 'loadFind', loadFind)
}

export function listable(Repository) {
  decorate(Repository, 'list', function () {
    return list
      .call(this, ...arguments)
      .then(data => this.create(data))
  })
  decorate(Repository, 'loadList', loadList)
}

export function searchable(Repository) {
  decorate(Repository, 'search', function () {
    return search
      .call(this, ...arguments)
      .then(data => this.create(data))
  })
  decorate(Repository, 'loadSearch', loadSearch)
}

export function saveable(Repository) {
  decorate(Repository, 'save', function () {
    return save
      .call(this, ...arguments)
      .then(data => this.create(data))
  })
}

export function destroyable(Repository) {
  decorate(Repository, 'destroy', destroy)
}

function find(id, params = null, { cache = false } = {}) {
  const action = 'read'
  const path = buildPath.call(this, id)
  return this.sync(action, path, null, params, { cache })
}

function loadFind(...args) {
  return load.call(this, 'find', ...args)
}

function list(where, params = {}, { cache = false } = {}) {
  const action = 'read'
  const path = buildPath.call(this)
  params.$where = where
  return this.sync(action, path, null, params, { cache })
}

function loadList(...args) {
  return load.call(this, 'list', ...args)
}

function search(text, params = {}, { cache = false } = {}) {
  const action = 'read'
  const path = buildPath.call(this)
  params.$search = text
  return this.sync(action, path, null, params, { cache })
}

function loadSearch(...args) {
  return load.call(this, 'search', ...args)
}

function save(model, params = null, { replace = false, cache = false } = {}) {
  const isCollection = Array.isArray(model)
  let action, payload, id
  if (isCollection) {
    action = replace ? 'replace' : 'update'
    payload = model.map(instance => this.serialize(instance))
  }
  else {
    id = model.id
    action = id ? replace ? 'replace' : 'update' : 'create'
    payload = this.serialize(model)
  }
  const path = buildPath.call(this, model.id)
  return this.sync(action, path, payload, params, { cache })
}

function destroy(model, params = {}) {
  const isCollection = Array.isArray(model)
  const models = isCollection ? model : [model]
  const toSync = models.filter(model => !!model.id)
  let promise
  if (!toSync.length) {
    this.clear()
    promise = Promise.resolve()
  }
  else if (isCollection) {
    params.$destroy = true
    promise = save.call(this, toSync, params)
  }
  else {
    const action = 'destroy'
    const path = buildPath.call(this, model.id)
    promise = this.sync(action, path, null, params)
  }
  return promise.then(() => models.forEach(model => model._data = null))
}

function decorate(Class, prop, fn) {
  Object.defineProperty(Class.prototype, prop, { value: fn })
}

function buildPath(id) {
  const path = this.collection || ''
  return id ? path + '/' + id : path
}

function load(query, criteria, params) {
  return this[query](criteria, params, { cache: true }).then(() => this)
}
