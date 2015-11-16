
export function persistable(target) {
  Object.defineProperty(target.prototype, 'save', {
    value: save
  })
}

function save(instance, { patch = false, $returning = {} } = {}) {
  const { url, Model } = this
  const { id } = instance
  const method = id ? patch ? 'patch' : 'put' : 'post'
  const path = (method === 'post') ? url : `${url}/${id}`
  const payload = Model.serialize(instance)
  const query = { $returning }
  return this.sync(path, method, payload, query)
}

export function searchable(target) {
  Object.defineProperty(target.prototype, 'search', {
    value: search
  })
}

function search({ $search = '', $returning = {} } = {}) {
  const method = 'get'
  const path = this.url
  const query = { $search, $returning }
  return this.sync(path, method, undefined, query)
}

export function listable(target) {
  Object.defineProperty(target.prototype, 'list', {
    value: list
  })
}

function list({ $params = {}, $relations = [] }) {
  const method = 'get'
  const path = this.url
  const query = { $params, $relations }
  return this.sync(path, method, undefined, query)
}

export function destroyable(target) {
  Object.defineProperty(target.prototype, 'destroy', {
    value: destroy
  })
}

function destroy(model) {
  const { url } = this
  const { id } = model
  const method = 'delete'
  const path = `${url}/${id}`
  return this.sync(path, method)
}
