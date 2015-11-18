
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import Model from '../src/model'
import Repository from '../src/repository'
import * as decorators from '../src/decorators'
const { findable, saveable, searchable, destroyable } = decorators

chai.use(sinonChai)

const { expect } = chai
let api

describe('decorators', () => {

  beforeEach(() => {
    const methods = ['fetch', 'replace', 'create', 'update', 'destroy']
    api = methods.reduce((api, method) => {
      return Object.assign(api, { [method]: sinon.stub() })
    }, {})
  })

  describe('@findable', () => {

    let repository

    beforeEach(() => {
      @findable
      class Decorated extends Repository {
        constructor() {
          super(...arguments)
          this.path = 'test'
        }
      }
      repository = new Decorated(api, Model)
    })

    it('adds #find(id, query)', () => {
      expect(repository).to.respondTo('find')
    })

    it('calls api#fetch with resource and default query', () => {
      api.fetch.returns(Promise.resolve())
      repository.find(1)
      expect(api.fetch)
        .to.have.been.calledWithExactly('test/1', undefined, undefined)
    })

    it('calls api#fetch with resource and passed query', () => {
      const query = {}
      api.fetch.returns(Promise.resolve())
      repository.find(1, query)
      expect(api.fetch)
        .to.have.been.calledWithExactly('test/1', undefined, query)
    })

  })

  describe('@saveable', () => {

    let repository

    beforeEach(() => {
      @saveable
      class Decorated extends Repository {
        constructor() {
          super(...arguments)
          this.path = 'test'
        }
      }
      repository = new Decorated(api, Model)
    })

    it('adds #save(model, query)', () => {
      expect(repository).to.respondTo('save')
    })

    context('when model has no #id', () => {
      it('calls api#create with model#data', () => {
        api.create.returns(Promise.resolve())
        const model = new Model()
        repository.save(model)
        expect(api.create)
          .to.have.been.calledWithExactly('test', {}, undefined)
      })
    })

    context('when model has an #id', () => {
      it('calls api#update with model#data', () => {
        api.update.returns(Promise.resolve())
        const model = new Model({ id: 1 })
        repository.save(model)
        expect(api.update)
          .to.have.been.calledWithExactly('test/1', { id: 1 }, undefined)
      })
    })

    context('when (model) has an #id', () => {
      context('and (options)#replace is true', () => {
        it('calls api#replace with model#data', () => {
          api.replace.returns(Promise.resolve())
          const model = new Model({ id: 1 })
          repository.save(model, {}, { replace: true })
          expect(api.replace)
            .to.have.been.calledWithExactly('test/1', { id: 1 }, {})
        })
      })
    })

  })

  describe('@searchable', () => {

    let repository

    beforeEach(() => {
      @searchable
      class Decorated extends Repository {
        constructor() {
          super(...arguments)
          this.path = 'test'
        }
      }
      repository = new Decorated(api, Model)
    })

    it('adds #search(query)', () => {
      expect(repository).to.respondTo('search')
    })

    it('calls api#fetch with default query', () => {
      api.fetch.returns(Promise.resolve())
      repository.search()
      expect(api.fetch)
        .to.have.been.calledWithExactly('test', undefined, undefined)
    })

    it('calls api#fetch with passed query', () => {
      const query = {}
      api.fetch.returns(Promise.resolve())
      repository.search(query)
      expect(api.fetch)
        .to.have.been.calledWithExactly('test', undefined, query)
    })

  })

  describe('@destroyable', () => {

    let repository

    beforeEach(() => {
      @destroyable
      class Decorated extends Repository {
        constructor() {
          super(...arguments)
          this.path = 'test'
        }
      }
      repository = new Decorated(api, Model)
    })

    it('adds #destroy(model)', () => {
      expect(repository).to.respondTo('destroy')
    })

    context('when (model) has an #id', () => {
      it('calls api#destroy', () => {
        api.destroy.returns(Promise.resolve())
        const model = new Model({ id: 1 })
        repository.destroy(model)
        expect(api.destroy)
          .to.have.been.calledWithExactly('test/1')
      })
    })

    context('when (model) does not have an #id', () => {
      it('resolves a fresh instance of #Model', () => {
        api.destroy.returns(Promise.resolve())
        const model = new Model()
        return repository.destroy(model)
          .then(fresh => {
            expect(api.destroy).not.to.have.been.called
            expect(fresh).not.to.equal(model)
            expect(fresh).to.be.instanceOf(Model)
          })
      })
    })

  })

})
