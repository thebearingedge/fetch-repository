
export function findById(Repository) {
  Object.defineProperty(Repository.prototype, 'findById', {
    value: function findById(id, { $returning = {} } = {}) {
      const method = 'get'
      const path = this.buildPath(id)
      const query = { $returning }
      return this.sync(method, path, undefined, query)
    }
  })
}

export function save(Repository) {
  Object.defineProperty(Repository.prototype, 'save', {
    value: function save(model, { patch = false, $returning = {} } = {}) {
      const { id } = model
      const body = this.serialize(model)
      const method = id != null ? patch ? 'patch' : 'put' : 'post'
      const path = this.buildPath(id)
      const query = { $returning }
      return this.sync(method, path, body, query)
    }
  })
}

export function list(Repository) {
  Object.defineProperty(Repository.prototype, 'list', {
    value: function list(query = {}) {
      const method = 'get'
      const path = this.buildPath()
      return this.sync(method, path, undefined, query)
    }
  })
}

export function destroy(Repository) {
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
