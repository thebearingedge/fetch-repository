
export default class Repository {

  constructor(api, Model) {
    this.resource = null
    this.api = api
    this.Model = Model
  }

  get url() {
    return this.resource || ''
  }

  create(data = {}) {
    const { Model } = this
    return Array.isArray(data)
      ? data.map(record => new Model(record))
      : new Model(data)
  }

  findById(id, { $returning = {} } = {}) {
    const { url } = this
    const method = 'get'
    const path = `${url}/${id}`
    const query = { $returning }
    return this.sync(path, method, undefined, query)
  }

  sync(method, path, payload, query = {}) {
    return this
      .api[method](path, payload, query)
      .then(data => this.create(data))
  }

}
