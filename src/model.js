
export default class Model {

  constructor(data = {}) {
    this._data = data
  }

  get idAttribute() { return 'id' }

  get data() { return this._data }

  get id() {
    return this._data[this.idAttribute] || null
  }

}
