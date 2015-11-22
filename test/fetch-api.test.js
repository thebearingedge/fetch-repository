
import { expect } from 'chai'
import sinon from 'sinon'
import FetchApi from '../src/fetch-api'

describe('FetchApi', () => {

  describe('constructor(fetch, { base, headers })', () => {
    it('has default #base and #headers properties', () => {
      const fetch = () => {}
      const api = new FetchApi(fetch)
      expect(api).to.have.property('base', null)
      expect(api).to.have.property('headers').that.deep.equals({
        'content-type': 'application/json'
      })
    })
  })

  describe('onRejection(err)', () => {

    let fetch, api

    beforeEach(() => {
      fetch = sinon.stub()
      api = new FetchApi(fetch)
    })

    context('when fetch is rejected', () => {
      it('is called', () => {
        const reason = new Error()
        fetch.returns(Promise.reject(reason))
        const onRejection = sinon.spy(api, 'onRejection')
        return api
          .send()
          .catch(err => {
            expect(onRejection).to.have.been.calledOnce
            expect(err).to.equal(reason)
          })
      })
    })

    context('when fetch is fulfilled', () => {
      it('is not called', () => {
        const res = { json() {} }
        fetch.returns(Promise.resolve(res))
        const onRejection = sinon.spy(api, 'onRejection')
        return api
          .send()
          .then(() => {
            expect(onRejection).not.to.have.been.called
          })
      })
    })

  })

  describe('send(method, path, body, params, headers)', () => {

    it('is called by actions and passed the correct method', () => {
      const res = { json() {} }
      const fetch = sinon.stub().returns(Promise.resolve(res))
      const api = new FetchApi(fetch)
      const actionMap = {
        read: 'GET',
        create: 'POST',
        replace: 'PUT',
        update: 'PATCH',
        destroy: 'DELETE'
      }
      Object.keys(actionMap).forEach(action => {
        const send = sinon.stub(api, 'send')
        const method = actionMap[action]
        api[action]()
        expect(send).to.have.been.calledWith(method)
        send.restore()
      })
    })

    it('parses query params', () => {
      const res = { json() {} }
      const fetch = sinon.stub().returns(Promise.resolve(res))
      const api = new FetchApi(fetch)
      return api
        .send(null, null, null, ({ foo: 'bar' }))
        .then(() => {
          const url = fetch.getCall(0).args[0]
          expect(url).to.equal('?foo=bar')
        })
    })

    it('builds a url', () => {
      class WithBase extends FetchApi {
        constructor(fetch) {
          super(fetch)
        }
        get base() { return 'foo' }
      }
      const res = { json() {} }
      const fetch = sinon.stub().returns(Promise.resolve(res))
      const api = new WithBase(fetch)
      return api
        .send(null, '/bar', null, ({ baz: 'qux' }))
        .then(() => {
          const url = fetch.getCall(0).args[0]
          expect(url).to.equal('foo/bar?baz=qux')
        })
    })

  })

})
