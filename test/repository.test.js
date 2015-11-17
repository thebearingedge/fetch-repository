
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
      expect(repository).to.have.property('api', api)
      expect(repository).to.have.property('Model', Model)
    })

  })

  describe('create(json)', () => {

    let repository, SpyModel

    beforeEach(() => {
      SpyModel = sinon.spy()
      repository = new Repository(api, SpyModel)
    })

    context('when (json) is not an Array', () => {
      it('instantiates the Model with (json)', () => {
        const json = {}
        const model = repository.create(json)
        expect(SpyModel).to.have.been.calledWithExactly(json)
        expect(model).to.be.instanceOf(SpyModel)
      })
    })

    context('when (json) is an array', () => {
      it('instantiates an array of models', () => {
        const json = [{}, {}]
        const models = repository.create(json)
        expect(models).to.be.instanceOf(Array)
        models.forEach(model => {
          expect(model).to.be.instanceOf(SpyModel)
        })
      })
    })

  })

  describe('#resource', () => {

    let repository

    beforeEach(() => repository = new Repository(api, Model))

    context('when #path is falsy', () => {
      it('is null', () => {
        expect(repository).to.have.property('resource', null)
      })
    })

    context('when #path has a leading slash', () => {
      it('trims the leading slash', () => {
        repository.path = '/foo/bar'
        expect(repository).to.have.property('resource', 'foo/bar')
      })
    })

    context('when #path has a trailing slash', () => {
      it('trims the trailing slash', () => {
        repository.path = 'foo/bar/'
        expect(repository).to.have.property('resource', 'foo/bar')
      })
    })

    context('when #path has leading and trailing slashes', () => {
      it('trims the slashes', () => {
        repository.path = '/foo/bar/'
        expect(repository).to.have.property('resource', 'foo/bar')
      })
    })

  })

  describe('buildPath(id)', () => {

    let repository

    beforeEach(() => repository = new Repository(api, Model))

    context('when #path is null', () => {
      context('and (id) is null', () => {
        it('returns ""', () => {
          const result = repository.buildPath()
          expect(result).to.equal('')
        })
      })
      context('and (id) is not null', () => {
        it('returns "/(id)"', () => {
          const result = repository.buildPath(1)
          expect(result).to.equal('1')
        })
      })
    })

    context('when #path is not null', () => {
      context('and (id) is null', () => {
        it('returns #resource', () => {
          repository.path = '/foo/bar'
          const result = repository.buildPath()
          expect(result).to.equal('foo/bar')
        })
      })
      context('and (id) is null', () => {
        it('returns "#resource/(id)"', () => {
          repository.path = '/foo/bar'
          const result = repository.buildPath(1)
          expect(result).to.equal('foo/bar/1')
        })
      })
    })

  })

  describe('sync(method, path, payload, query)', () => {

    let repository

    beforeEach(() => repository = new Repository(api, Model))

    it('calls (method) on #api with (...args)', () => {
      api.get = sinon.stub().returns(Promise.resolve())
      const args = ['test', {}, {}]
      return repository.sync('get', ...args)
        .then(() => {
          expect(api.get).to.have.been.calledWithExactly('test', {}, {})
        })
    })

    it('returns a new instance of #Model', () => {
      api.get = () => Promise.resolve()
      return repository.sync('get')
        .then(model => {
          expect(model).to.be.instanceOf(Model)
        })
    })

  })

  describe('serialize(model)', () => {

    it('returns model#json', () => {
      const json = {}
      const repository = new Repository(api, Model)
      const model = repository.create(json)
      const serialized = repository.serialize(model)
      expect(serialized).to.equal(model.json)
    })

  })

})
