
import { expect } from 'chai'
import sinon from 'sinon'
import stringify from 'qs/lib/stringify'
import FetchApi from '../src/fetch-api'

describe('FetchApi', () => {

  describe('constructor(fetch, options)', () => {
    it('has #fetch, #origin, #base, and #headers properties', () => {
      const fetch = () => {}
      let base, headers, api
      api = new FetchApi(fetch)
      expect(api).to.have.property('fetch', fetch)
      expect(api).to.have.property('base', null)
      base = '/foo'
      headers = { 'x-test-header': 'bar' }
      api = new FetchApi(fetch, { base, headers })
      expect(api).to.have.property('fetch', fetch)
      expect(api).to.have.property('base', '/foo')
      expect(api).to.have.property('headers', headers)
      base = '/foo/'
      api = new FetchApi(fetch, { base })
      expect(api).to.have.property('base', '/foo')
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

    let res, fetch, api

    beforeEach(() => {
      res = { json() {} }
      fetch = sinon.stub().returns(Promise.resolve(res))
      api = new FetchApi(fetch)
    })

    it('is called by actions and passed the correct method', () => {
      const actionMap = {
        read: 'GET',
        create: 'POST',
        replace: 'PUT',
        update: 'PATCH',
        destroy: 'DELETE'
      }
      Object.keys(actionMap).forEach(action => {
        const send = sinon.stub(api, 'send')
        api[action]()
        expect(send).to.have.been.calledWith(actionMap[action])
        send.restore()
      })
    })

    it('merges headers', () => {
      api.headers = { foo: 'bar' }
      const merged = { foo: 'bar', baz: 'qux' }
      return api
        .send(null, null, null, null, { baz: 'qux' })
        .then(() => {
          const options = fetch.getCall(0).args[1]
          expect(options).to.have.property('headers').eql(merged)
        })
    })

    it('parses query params', () => {
      api.parseQuery = params => stringify(params)
      return api
        .send(null, null, null, ({ foo: 'bar' }))
        .then(() => {
          const url = fetch.getCall(0).args[0]
          expect(url).to.equal('?foo=bar')
        })
    })

    it('builds a url', () => {
      api.base = 'foo'
      api.parseQuery = params => stringify(params)
      return api
        .send(null, '/bar', null, ({ baz: 'qux' }))
        .then(() => {
          const url = fetch.getCall(0).args[0]
          expect(url).to.equal('foo/bar?baz=qux')
        })
    })

  })

})
