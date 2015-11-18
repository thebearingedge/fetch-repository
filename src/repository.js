
export default class Repository {

  constructor(api, Model) {
    this.api = api
    this.Model = Model
  }

  get resource() {
    if (!this.path) return null
    return this.path.match(/[^\/]+/g).join('/')
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

  sync(method, ...args) {
    return this
      .api[method](...args)
      .then(data => this.create(data))
  }

}
