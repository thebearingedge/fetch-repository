
export default class Repository {

  constructor(api, Model) {
    this.api = api
    this.Model = Model
  }

  get resource() {
    return this.path
      ? this.path.match(/[^\/]+/g).join('/')
      : null
  }

  create(json) {
    return Array.isArray(json)
      ? json.map(record => new this.Model(record))
      : new this.Model(json)
  }

  buildPath(id) {
    return [this.resource, id].filter(path => !!path).join('/')
  }

  serialize(model) {
    return model.json
  }

  sync(method, ...args) {
    return this
      .api[method](...args)
      .then(json => this.create(json))
  }

}
