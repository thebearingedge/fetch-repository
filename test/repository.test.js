
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
    const methods = [ 'read', 'replace', 'create', 'update', 'destroy' ]
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

  describe('create(data)', () => {

    let repository, SpyModel

    beforeEach(() => {
      SpyModel = sinon.spy()
      repository = new Repository(api, SpyModel)
    })

    context('when (data) is not an Array', () => {
      it('instantiates the Model with (data)', () => {
        const data = {}
        const model = repository.create(data)
        expect(SpyModel).to.have.been.calledWithExactly(data)
        expect(model).to.be.instanceOf(SpyModel)
      })
    })

    context('when (data) is an array', () => {
      it('instantiates an array of models', () => {
        const data = [{}, {}]
        const models = repository.create(data)
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
      api.read = sinon.stub().returns(Promise.resolve())
      const args = ['test', {}, {}]
      return repository.sync('read', ...args)
        .then(() => {
          expect(api.read).to.have.been.calledWithExactly('test', {}, {})
        })
    })

    it('returns a new instance of #Model', () => {
      api.read = () => Promise.resolve({})
      return repository.sync('read')
        .then(model => {
          expect(model).to.be.instanceOf(Model)
        })
    })

  })

  describe('serialize(model)', () => {

    it('returns model#data', () => {
      const data = {}
      const repository = new Repository(api, Model)
      const model = repository.create(data)
      const serialized = repository.serialize(model)
      expect(serialized).to.equal(model.data)
    })

  })

})
