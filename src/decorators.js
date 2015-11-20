
export function findable(Repository) {
  Object.defineProperties(Repository.prototype, {
    find: { value: find },
    loadFind: { value: loadFind }
  })
}

export function saveable(Repository) {
  Object.defineProperty(Repository.prototype, 'save', { value: save })
}

export function searchable(Repository) {
  Object.defineProperties(Repository.prototype, {
    search: { value: search },
    loadSearch: { value: loadSearch }
  })
}

export function destroyable(Repository) {
  Object.defineProperty(Repository.prototype, 'destroy', { value: destroy })
}

function find(id, params, { cache = false } = {}) {
  const action = 'read'
  const path = this.buildPath(id)
  return this.sync(action, path, undefined, params, { cache })
}

function loadFind(...args) {
  return this
    .find(...args)
    .then(loaded => {
      this._cache = loaded
      return this
    })
}

function save(model, params, { replace = false, cache = false } = {}) {
  const isCollection = Array.isArray(model)
  let action, body, path
  if (isCollection) {
    action = replace ? 'replace' : 'update'
    body = model.map(instance => this.serialize(instance))
    path = this.buildPath()
  }
  else {
    action = model.id ? replace ? 'replace' : 'update' : 'create'
    body = this.serialize(model)
    path = this.buildPath(model.id)
  }
  return this.sync(action, path, body, params, { cache })
}

function search(params, { cache = false } = {}) {
  const action = 'read'
  const path = this.buildPath()
  return this.sync(action, path, undefined, params, { cache })
}

function loadSearch(...args) {
  return this
    .search(...args)
    .then(loaded => {
      this._cache = loaded
      return this
    })
}

function destroy(model, params = {}) {
  const isCollection = Array.isArray(model)
  const models = isCollection ? model : [model]
  const saved = models.filter(instance => !!instance.id)
  let promise
  if (!saved.length) {
    promise = Promise.resolve()
  }
  else if (isCollection) {
    params.$destroy = true
    promise = save.call(this, saved, params)
  }
  else {
    const action = 'destroy'
    const { id } = models[0]
    const path = this.buildPath(id)
    promise = this.sync(action, path, undefined, params)
  }
  return promise.then(() => {
    models.forEach(instance => instance._data = null)
  })
}
