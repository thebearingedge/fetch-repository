
export default class Repository {

  constructor(api, Model) {
    this.api = api
    this.Model = Model
  }

  get resource() {
    return this.path != null
      ? this.path.match(/[^\/]+/g).join('/')
      : ''
  }

  create(json) {
    return Array.isArray(json)
      ? json.map(record => new this.Model(record))
      : new this.Model(json)
  }

  buildPath(id) {
    const { resource } = this
    return [resource, id].filter(path => !!path).join('/')
  }

  serialize(model) {
    return model.json
  }

  sync(method, ...args) {
    return this
      .api[method](...args)
      .then(json => json ? this.create(json) : undefined)
  }

}
