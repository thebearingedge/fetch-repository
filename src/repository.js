
export default class Repository {

  constructor(api, Model) {
    this.api = api
    this.Model = Model
  }

  get resource() {
    if (!this.path) return null
    return this.path.match(/[^\/]+/g).join('/')
  }

  get cache() {
    return this._cache
  }

  clear() {
    this._cache = null
  }

  create(data) {
    return Array.isArray(data)
      ? data.map(datum => new this.Model(datum))
      : new this.Model(data)
  }

  buildPath(id) {
    const parts = [this.resource, id]
    return parts.filter(part => !!part).join('/')
  }

  serialize(model) {
    return model.data
  }

  sync(action, path, body, params, { cache = false } = {}) {
    return this
      .api[action](path, body, params)
      .then(data => {
        this.clear()
        if (!data) return
        const created = this.create(data)
        return cache ? (this._cache = created) : created
      })
  }

}
