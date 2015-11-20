
export default class FetchApi {

  constructor(fetch, { base, headers } = {}) {
    if (!base || base === '/') {
      this.base = null
    }
    else if (base.endsWith('/')) {
      this.base = base.slice(0, base.length - 1)
    }
    else {
      this.base = base
    }
    this.fetch = fetch
    this.headers = headers
  }

  parseQuery() {}

  parseResponse(res) { return res.json() }

  parseBody(body) { return JSON.stringify(body) }

  onBeforeSend(url, options) { return [url, options] }

  onRejection(err) { throw err }

  send(method, path, body, params, _headers) {
    const { base, headers } = this
    let url = base || ''
    if (path) url += '/' + path.match(/[^\/]+/g).join('/')
    const queryString = this.parseQuery(params)
    if (queryString) url += '?' + queryString
    const options = {
      method,
      headers: Object.assign({}, headers, _headers),
      body: this.parseBody(body)
    }
    return Promise
      .resolve(this.onBeforeSend(url, options))
      .then((args) => this.fetch(...args))
      .then(res => this.parseResponse(res))
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
