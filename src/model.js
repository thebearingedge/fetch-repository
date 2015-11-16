
class Model {

  static serialize(instance) {
    return JSON.stringify(instance._data)
  }

  constructor(data = {}) {
    this._data = data
  }

  get idAttribute() {
    return 'id'
  }

  get id() {
    const { idAttribute, _data } = this
    return _data[idAttribute] || null
  }

}

export default Model
