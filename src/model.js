
export default class Model {

  constructor(data = null) {
    this._data = data
  }

  get idAttribute() {
    return 'id'
  }

  get id() {
    const { _data, idAttribute } = this
    return _data ? _data[idAttribute] : null
  }

  get data() {
    return this._data || {}
  }

}
