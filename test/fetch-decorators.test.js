
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import Model from '../src/model'
import Repository from '../src/repository'
import * as decorators from '../src/fetch-decorators'

chai.use(sinonChai)

const { expect } = chai
const { findable, listable, searchable, saveable, destroyable } = decorators

describe('decorators', () => {

  describe('@findable', () => {

    let api, repository

    beforeEach(() => {
      @findable
      class Decorated extends Repository {
        constructor(api) { super(api) }
        get collection() { return 'test' }
      }
      api = { read: sinon.stub() }
      repository = new Decorated(api, Model)
    })

    it('adds #find(id, query) and #loadFind(id, query)', () => {
      expect(repository).to.respondTo('find')
      expect(repository).to.respondTo('loadFind')
    })

    it('can load a model and return the repository', () => {
      api.read.returns(Promise.resolve({ id: 1 }))
      return repository
        .loadFind(1)
        .then(repo => {
          const cached = repo.cache
          expect(cached).to.be.an.instanceOf(Model)
          expect(repo).to.equal(repository)
        })
    })

    it('calls api#read with a path that includes the model#id', () => {
      api.read.returns(Promise.resolve())
      repository.find(1)
      expect(api.read)
        .to.have.been.calledWithExactly('test/1', null, null)
    })

    it('calls api#read with resource and passed query', () => {
      const query = {}
      api.read.returns(Promise.resolve())
      repository.find(1, query)
      expect(api.read)
        .to.have.been.calledWithExactly('test/1', null, query)
    })

    it('can omit a #collection and cache results', () => {
      @findable
      class Decorated extends Repository {
        constructor() { super(...arguments) }
      }
      api = { read: sinon.stub() }
      repository = new Decorated(api, Model)
      api.read.returns(Promise.resolve())
      repository
        .find(1, null, { cache: true })
        .then(found => {
          const cached = repository.cache
          expect(cached).to.equal(found)
          expect(api.read)
            .to.have.been.calledWithExactly('/1')
        })
    })

  })

  describe('@listable', () => {

    let api, repository

    beforeEach(() => {
      @listable
      class Decorated extends Repository {
        constructor(api) { super(api) }
        get collection() { return 'test' }
      }
      api = { read: sinon.stub() }
      repository = new Decorated(api, Model)
    })

    it('adds #list(where, params) and #loadList(where, params)', () => {
      expect(repository).to.respondTo('list')
      expect(repository).to.respondTo('loadList')
    })

    it('merges (where) into params and reads from #api', () => {
      api.read.returns(Promise.resolve([{}]))
      const where = { foo: 'bar' }
      return repository
        .list(where)
        .then(() => {
          expect(api.read)
            .to.have.been.calledWithExactly('test', null, { $where: where })
        })
    })

    it('caches models and returns repository', () => {
      api.read.returns(Promise.resolve([{}, {}]))
      return repository
        .loadList({ foo: 'bar' })
        .then(repo => {
          expect(repo).to.equal(repository)
          repo.cache.forEach(model => {
            expect(model).to.be.an.instanceOf(Model)
          })
        })
    })
  })

  describe('@searchable', () => {

    let api, repository

    beforeEach(() => {
      @searchable
      class Decorated extends Repository {
        constructor(api) { super(api) }
        get collection() { return 'test' }
      }
      api = { read: sinon.stub() }
      repository = new Decorated(api, Model)
    })

    it('adds #search(query) and #loadSearch', () => {
      expect(repository).to.respondTo('search')
      expect(repository).to.respondTo('loadSearch')
    })

    it('caches models and returns repository', () => {
      api.read.returns(Promise.resolve([{}, {}]))
      return repository
        .loadSearch('baz')
        .then(repo => {
          expect(repo).to.equal(repository)
          repo.cache.forEach(model => {
            expect(model).to.be.an.instanceOf(Model)
          })
        })
    })

    it('calls api#read with default params', () => {
      api.read.returns(Promise.resolve())
      repository.search()
      expect(api.read)
        .to.have.been.calledWithExactly('test', null, { $search: undefined })
    })

    it('can merge query params and cache result', () => {
      const query = { foo: 'bar' }
      const params = { foo: 'bar', $search: 'baz' }
      api.read.returns(Promise.resolve([{}]))
      return repository
        .search('baz', query, { cache: true })
        .then(data => {
          const cached = repository.cache
          expect(api.read)
            .to.have.been.calledWithExactly('test', null, params)
          expect(cached).to.deep.equal(data)
        })

    })

  })

  describe('@saveable', () => {

    let api, repository

    beforeEach(() => {
      @saveable
      class Decorated extends Repository {
        constructor(api) { super(api) }
        get collection() { return 'test' }
      }
      api = {}
      repository = new Decorated(api, Model)
    })

    it('adds #save(model, query)', () => {
      expect(repository).to.respondTo('save')
    })

    context('when model has no #id', () => {
      it('calls api#create with model#data', () => {
        api.create = sinon.stub().returns(Promise.resolve())
        const model = new Model()
        repository.save(model)
        expect(api.create)
          .to.have.been.calledWithExactly('test', {}, null)
      })
    })

    context('when model has an #id', () => {
      it('calls api#update with model#data', () => {
        api.update = sinon.stub().returns(Promise.resolve())
        const model = new Model({ id: 1 })
        repository.save(model)
        expect(api.update)
          .to.have.been.calledWithExactly('test/1', { id: 1 }, null)
      })
    })

    context('when (model) has an #id', () => {
      context('and (options)#replace is true', () => {
        it('calls api#replace with model#data', () => {
          api.replace = sinon.stub().returns(Promise.resolve())
          const model = new Model({ id: 1 })
          repository.save(model, {}, { replace: true })
          expect(api.replace)
            .to.have.been.calledWithExactly('test/1', { id: 1 }, {})
        })
      })
    })

    context('when (model) is an array', () => {
      it('it calls api#update on the resource', () => {
        api.update = sinon.stub().returns(Promise.resolve([]))
        const data = [{ id: 1 }, { id: 2 }]
        const models = data.map(data => new Model(data))
        repository.save(models)
        expect(api.update)
          .to.have.been.calledWithExactly('test', data, null)
      })
    })

    context('when (model) is an array', () => {
      context('and (options)#replace is true', () => {
        it('it calls api#replace on the resource', () => {
          api.replace = sinon.stub().returns(Promise.resolve([]))
          const data = [{ id: 1 }, { id: 2 }]
          const models = data.map(data => new Model(data))
          repository.save(models, {}, { replace: true })
          expect(api.replace)
            .to.have.been.calledWithExactly('test', data, {})
        })
      })
    })

  })


  describe('@destroyable', () => {

    let api, repository

    beforeEach(() => {
      @destroyable
      class Decorated extends Repository {
        constructor(api) { super(api) }
        get collection() { return 'test' }
      }
      api = {}
      repository = new Decorated(api, Model)
    })

    it('adds #destroy(model)', () => {
      expect(repository).to.respondTo('destroy')
    })

    context('when (model) has an #id', () => {
      it('calls api#destroy', () => {
        api.destroy = sinon.stub().returns(Promise.resolve())
        const model = new Model({ id: 1 })
        repository.destroy(model)
        expect(api.destroy)
          .to.have.been.calledWithExactly('test/1', null, {})
      })
    })

    context('when (model) does not have an #id', () => {
      it('does not call api#destroy', () => {
        api.destroy = sinon.stub().returns(Promise.resolve())
        const model = new Model()
        return repository
          .destroy(model)
          .then(returned => {
            expect(api.destroy).not.to.have.been.called
            expect(returned).to.be.undefined
          })
      })
    })

    context('when (model) is an array', () => {
      it('updates the resource with existing model data', () => {
        api.update = sinon.stub().returns(Promise.resolve())
        api.destroy = sinon.stub().returns(Promise.reject())
        const data = [{ id: 1 }, {}]
        const models = data.map(datum => new Model(datum))
        const $destroy = true
        return repository
          .destroy(models, {})
          .then(returned => {
            expect(api.update)
              .to.have.been.calledWithExactly('test', [data[0]], { $destroy })
            expect(api.destroy).not.to.have.been.called
            expect(returned).to.be.undefined
          })
      })
    })

    context('when (model) is an array of new models', () => {
      it('clears the models', () => {
        api.update = sinon.stub().returns(Promise.reject())
        api.destroy = sinon.stub().returns(Promise.reject())
        const data = [{ foo: 'bar' }, { baz: 'qux' }]
        const models = data.map(datum => new Model(datum))
        return repository
          .destroy(models)
          .then(() => {
            models.forEach(model => expect(model.data).to.be.null)
          })
      })
    })

  })

})
