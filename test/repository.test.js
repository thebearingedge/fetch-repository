
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import Repository from '../src/repository'
import Model from '../src/model'

chai.use(sinonChai)

const { expect } = chai

describe('Repository', () => {

  let api

  beforeEach(() => {
    const methods = [ 'get', 'put', 'post', 'patch', 'delete' ]
    api = methods.reduce((api, method) => {
      return Object.assign(api, { [method]: sinon.spy() })
    }, {})
  })

  describe('constructor(api, Model)', () => {

    it('stores a reference to (api) and (Model)', () => {
      const repository = new Repository(api, Model)
      expect(repository.api).to.equal(api)
      expect(repository.Model).to.equal(Model)
    })

  })

  describe('create(data)', () => {

    let repository, SpyModel

    beforeEach(() => {
      SpyModel = sinon.spy()
      repository = new Repository(api, SpyModel)
    })

    context('when (data) is not an Array', () => {
      it('instantiates the Model with (data)', () => {
        const data = { foo: 'bar' }
        const model = repository.create(data)
        expect(SpyModel).to.have.been.calledWithExactly(data)
        expect(model instanceof SpyModel).to.equal(true)
      })
    })

    context('when (data) is an array', () => {
      it('instantiates an collection of models', () => {
        const data = [{ foo: 'bar' }, { baz: 'qux' }]
        const models = repository.create(data)
        expect(Array.isArray(models)).to.equal(true)
        expect(models.every(model => model instanceof SpyModel)).to.equal(true)
      })
    })

  })

  describe('#resource', () => {

    let repository

    beforeEach(() => repository = new Repository(api, Model))

    context('when #path is falsy', () => {
      it('is an empty string', () => {
        expect(repository.resource).to.equal('')
      })
    })

    context('when #path has a leading slash', () => {
      it('trims the leading slash', () => {
        repository.path = '/foo/bar'
        expect(repository.resource).to.equal('foo/bar')
      })
    })

    context('when #path has a trailing slash', () => {
      it('trims the trailing slash', () => {
        repository.path = 'foo/bar/'
        expect(repository.resource).to.equal('foo/bar')
      })
    })

  })

  describe('buildPath(id)', () => {

    let repository

    beforeEach(() => repository = new Repository(api, Model))

    context('when #path is undefined', () => {
      context('and (id) is undefined', () => {
        it('returns ""', () => {
          expect(repository.buildPath()).to.equal('')
        })
      })
      context('and (id) is defined', () => {
        it('returns "/(id)"', () => {
          expect(repository.buildPath(1)).to.equal('1')
        })
      })
    })

    context('when #path is defined', () => {
      context('and (id) is undefined', () => {
        it('returns #resource', () => {
          repository.path = '/foo/bar'
          expect(repository.buildPath()).to.equal('foo/bar')
        })
      })
      context('and (id) is undefined', () => {
        it('returns "#resource/(id)"', () => {
          repository.path = '/foo/bar'
          expect(repository.buildPath(1)).to.equal('foo/bar/1')
        })
      })
    })

  })

  describe('sync(method, path, payload, query)', () => {

    let repository

    beforeEach(() => repository = new Repository(api, Model))

    it('calls (method) on #api with (...args)', () => {
      api.get = sinon.spy(() => Promise.resolve())
      const args = [{ foo: 'bar' }, { baz: 'qux' }, { quux: 'corge' }]
      return repository.sync('get', ...args)
        .then(() => expect(api.get).to.have.been.calledWithExactly(...args))
    })

    context('when data is returned', () => {
      it('returns a new instance of #Model', () => {
        api.get = sinon.spy(() => Promise.resolve({}))
        const args = [{ foo: 'bar' }, { baz: 'qux' }, { quux: 'corge' }]
        return repository.sync('get', ...args)
          .then(model => expect(model instanceof Model).to.equal(true))
      })
    })

  })

  describe('serialize(model)', () => {

    it('returns model#json', () => {
      const data = { foo: 'bar' }
      const repository = new Repository(api, Model)
      const model = repository.create(data)
      expect(repository.serialize(model)).to.equal(data)
    })

  })

})
