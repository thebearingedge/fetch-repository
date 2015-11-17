
export default class Model {

  constructor(json = {}) {
    this._json = json
  }

  get idAttribute() {
    return 'id'
  }

  get id() {
    return this._json[this.idAttribute] || null
  }

  get json() {
    return this._json
  }

}
