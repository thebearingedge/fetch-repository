
import deepClone from 'deep-clone'
import Model from './model'

export default class Repository {

  constructor(api) {
    this.api = api
  }

  get collection() { return null }

  get Model() { return Model }

  get cache() {
    const { _cache } = this
    return _cache ? this.create(_cache) : null
  }

  clear() {
    delete this._cache
  }

  create(_data) {
    const data = deepClone(_data)
    return Array.isArray(data)
      ? data.map(datum => new this.Model(datum))
      : new this.Model(data)
  }

  serialize(model) {
    return deepClone(model.data)
  }

  sync(action, resource, payload, params, { cache = false } = {}) {
    return this
      .api[action](resource, payload, params)
      .then(data => {
        this.clear()
        if (!data) return
        if (cache) this._cache = deepClone(data)
        return data
      })
  }

}
