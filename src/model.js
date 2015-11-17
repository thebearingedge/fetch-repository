
export default class Model {

  constructor(json = null) {
    this._json = json
  }

  get idAttribute() {
    return 'id'
  }

  get id() {
    const { _json, idAttribute } = this
    return _json ? _json[idAttribute] : null
  }

  get json() {
    return this._json || {}
  }

}
