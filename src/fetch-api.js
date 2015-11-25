
import stringify from 'qs/lib/stringify'

export default class FetchApi {

  constructor(fetch) {
    this.fetch = fetch
  }

  get base() {
    return null
  }

  get headers() {
    return { 'content-type': 'application/json' }
  }

  format(body) {
    return JSON.stringify(body)
  }

  onBeforeFetch(url, options) {
    return Promise.resolve(arguments)
  }

  onResponse(res) {
    return res.json()
  }

  parse(json) {
    return json ? json.data : json
  }

  onRejection(err) {
    throw err
  }

  send(method, path, payload, params) {
    const { base, headers } = this
    let url = base || ''
    if (path) url += '/' + path.match(/[^\/]+/g).join('/')
    const queryString = stringify(params)
    if (queryString) url += '?' + queryString
    const body = this.format(payload)
    const options = { method, body, headers }
    return this
      .onBeforeFetch(url, options)
      .then(args => this.fetch(...args))
      .then(res => this.onResponse(res))
      .then(data => this.parse(data))
      .catch(err => this.onRejection(err))
  }

}

const actionMap = {
  read: 'GET',
  create: 'POST',
  replace: 'PUT',
  update: 'PATCH',
  destroy: 'DELETE'
}

Object.keys(actionMap).forEach(action => {
  Object.defineProperty(FetchApi.prototype, action, {
    value: function () {
      const args = [actionMap[action], ...arguments]
      return this.send(...args)
    }
  })
})
