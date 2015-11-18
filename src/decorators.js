
export function findable(Repository) {
  Object.defineProperty(Repository.prototype, 'find', {
    value: function find(id, params) {
      const action = 'fetch'
      const path = this.buildPath(id)
      return this.sync(action, path, undefined, params)
    }
  })
}

export function saveable(Repository) {
  Object.defineProperty(Repository.prototype, 'save', {
    value: function save(model, params, { replace = false } = {}) {
      const body = this.serialize(model)
      const action = model.id ? replace ? 'replace' : 'update' : 'create'
      const path = this.buildPath(model.id)
      return this.sync(action, path, body, params)
    }
  })
}

export function searchable(Repository) {
  Object.defineProperty(Repository.prototype, 'search', {
    value: function search(params) {
      const action = 'fetch'
      const path = this.buildPath()
      return this.sync(action, path, undefined, params)
    }
  })
}

export function destroyable(Repository) {
  Object.defineProperty(Repository.prototype, 'destroy', {
    value: function destroy(model) {
      if (!model.id) return Promise.resolve(this.create({}))
      const action = 'destroy'
      const path = this.buildPath(model.id)
      return this.sync(action, path)
    }
  })
}
