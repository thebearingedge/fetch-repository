
export function findable(Repository) {
  Object.defineProperty(Repository.prototype, 'find', {
    value: function find(id, query) {
      const method = 'get'
      const path = this.buildPath(id)
      return this.sync(method, path, undefined, query)
    }
  })
}

export function saveable(Repository) {
  Object.defineProperty(Repository.prototype, 'save', {
    value: function save(model, query, { patch = false } = {}) {
      const { id } = model
      const body = this.serialize(model)
      const method = id ? patch ? 'patch' : 'put' : 'post'
      const path = this.buildPath(id)
      return this.sync(method, path, body, query)
    }
  })
}

export function searchable(Repository) {
  Object.defineProperty(Repository.prototype, 'search', {
    value: function search(query) {
      const method = 'get'
      const path = this.buildPath()
      return this.sync(method, path, undefined, query)
    }
  })
}

export function destroyable(Repository) {
  Object.defineProperty(Repository.prototype, 'destroy', {
    value: function destroy(model) {
      const { id } = model
      if (id == null) return Promise.resolve(this.create({}))
      const method = 'delete'
      const path = this.buildPath(id)
      return this.sync(method, path)
    }
  })
}
