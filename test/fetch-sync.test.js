
import { expect } from 'chai'
import sinon from 'sinon'
import stringify from 'qs/lib/stringify'
import Sync from '../src/fetch-sync'

describe('Sync', () => {

  describe('constructor(fetch, options)', () => {
    it('has #fetch, #origin, #base, and #headers properties', () => {
      const fetch = () => {}
      let base, headers, sync
      sync = new Sync(fetch)
      expect(sync).to.have.property('fetch', fetch)
      expect(sync).to.have.property('base', null)
      base = '/foo'
      headers = { 'x-test-header': 'bar' }
      sync = new Sync(fetch, { base, headers })
      expect(sync).to.have.property('fetch', fetch)
      expect(sync).to.have.property('base', '/foo')
      expect(sync).to.have.property('headers', headers)
      base = '/foo/'
      sync = new Sync(fetch, { base })
      expect(sync).to.have.property('base', '/foo')
    })
  })

  describe('onRejection(err)', () => {

    let fetch, sync

    beforeEach(() => {
      fetch = sinon.stub()
      sync = new Sync(fetch)
    })

    context('when fetch is rejected', () => {
      it('is called', () => {
        const reason = new Error()
        fetch.returns(Promise.reject(reason))
        const onRejection = sinon.spy(sync, 'onRejection')
        return sync
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
        const onRejection = sinon.spy(sync, 'onRejection')
        return sync
          .send()
          .then(() => {
            expect(onRejection).not.to.have.been.called
          })
      })
    })

  })

  describe('send(method, path, body, params, headers)', () => {

    let res, fetch, sync

    beforeEach(() => {
      res = { json() {} }
      fetch = sinon.stub().returns(Promise.resolve(res))
      sync = new Sync(fetch)
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
        const send = sinon.stub(sync, 'send')
        sync[action]()
        expect(send).to.have.been.calledWith(actionMap[action])
        send.restore()
      })
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
