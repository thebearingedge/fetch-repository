
import { expect } from 'chai'
import sinon from 'sinon'
import { stringify } from 'qs'
import FetchSync from '../src/fetch-sync'

describe('FetchSync', () => {

  describe('constructor(fetch, options)', () => {
    it('has #fetch, #origin, #base, and #headers properties', () => {
      const fetch = () => {}
      let base, headers, sync
      sync = new FetchSync(fetch)
      expect(sync).to.have.property('fetch', fetch)
      expect(sync).to.have.property('base', null)
      base = '/foo'
      headers = { 'x-test-header': 'bar' }
      sync = new FetchSync(fetch, { base, headers })
      expect(sync).to.have.property('fetch', fetch)
      expect(sync).to.have.property('base', '/foo')
      expect(sync).to.have.property('headers', headers)
      base = '/foo/'
      sync = new FetchSync(fetch, { base })
      expect(sync).to.have.property('base', '/foo')
    })
  })

  describe('onRejection(err)', () => {

    let sync

    beforeEach(() => sync = new FetchSync(() => {}))

    context('when fetch is rejected', () => {
      it('is called', () => {
        const reason = new Error()
        sinon.stub(sync, 'fetch').returns(Promise.reject(reason))
        const spy = sinon.spy(sync, 'onRejection')
        return sync
          .send()
          .catch(err => {
            expect(spy).to.have.been.calledOnce
            expect(err).to.equal(reason)
          })
      })
    })

    context('when fetch is fulfilled', () => {
      it('is not called', () => {
        const res = { json() {} }
        sinon.stub(sync, 'fetch').returns(Promise.resolve(res))
        const spy = sinon.spy(sync, 'onRejection')
        return sync
          .send()
          .then(() => {
            expect(spy).not.to.have.been.called
          })
      })
    })

  })

  describe('send(method, path, body, params, headers)', () => {

    let sync, res, fetch

    beforeEach(() => {
      sync = new FetchSync(() => {})
      res = { json() {} }
      fetch = sinon.stub(sync, 'fetch').returns(Promise.resolve(res))
    })

    it('merges headers', () => {
      sync.headers = { foo: 'bar' }
      const merged = { foo: 'bar', baz: 'qux' }
      return sync
        .send(null, null, null, null, { baz: 'qux' })
        .then(() => {
          const options = fetch.getCall(0).args[1]
          expect(options).to.have.property('headers').eql(merged)
        })
    })

    it('parses query params', () => {
      sync.parseQuery = params => stringify(params)
      return sync
        .send(null, null, null, ({ foo: 'bar' }))
        .then(() => {
          const url = fetch.getCall(0).args[0]
          expect(url).to.equal('?foo=bar')
        })
    })

    it('builds a url', () => {
      sync.base = 'foo'
      sync.parseQuery = params => stringify(params)
      return sync
        .send(null, '/bar', null, ({ baz: 'qux' }))
        .then(() => {
          const url = fetch.getCall(0).args[0]
          expect(url).to.equal('foo/bar?baz=qux')
        })
    })

  })

})
