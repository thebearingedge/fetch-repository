
export function findable(Repository) {
  Object.defineProperty(Repository.prototype, 'find', {
    value: find
  })
}

export function saveable(Repository) {
  Object.defineProperty(Repository.prototype, 'save', {
    value: save
  })
}

export function searchable(Repository) {
  Object.defineProperty(Repository.prototype, 'search', {
    value: search
  })
}

export function destroyable(Repository) {
  Object.defineProperty(Repository.prototype, 'destroy', {
    value: destroy
  })
}

function find(id, params) {
  const action = 'read'
  const path = this.buildPath(id)
  return this.sync(action, path, undefined, params)
}

function save(model, params, { replace = false } = {}) {
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
  return this.sync(action, path, body, params)
}

function search(params) {
  const action = 'read'
  const path = this.buildPath()
  return this.sync(action, path, undefined, params)
}

function destroy(model, params = {}) {
  if (Array.isArray(model)) {
    const old = model.filter(instance => !!instance.id)
    let promise
    if (!old.length) {
      promise = Promise.resolve()
    }
    else {
      params.$destroy = true
      promise = save.call(this, old, params)
    }
    return promise.then(() => {
      model.forEach(instance => instance._data = null)
    })
  }
  if (!model.id) return Promise.resolve()
  const action = 'destroy'
  const path = this.buildPath(model.id)
  return this
    .sync(action, path, params)
    .then(() => model._data = null)
}
