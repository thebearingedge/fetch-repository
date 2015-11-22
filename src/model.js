
import deepClone from 'deep-clone'

export default class Model {

  constructor(data = {}) {
    this._data = data
  }

  get idAttribute() { return 'id' }

  get data() {
    return deepClone(this._data)
  }

  get id() {
    return this._data[this.idAttribute] || null
  }

}
