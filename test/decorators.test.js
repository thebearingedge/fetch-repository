
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import Model from '../src/model'
import Repository from '../src/repository'
import * as decorators from '../src/decorators'
const { findable, saveable, searchable, destroyable } = decorators

chai.use(sinonChai)

const { expect } = chai

describe('decorators', () => {

  describe('@findable', () => {

    let api, repository

    beforeEach(() => {
      @findable
      class Decorated extends Repository {
        constructor() {
          super(...arguments)
          this.path = 'test'
        }
      }
      api = { read: sinon.stub() }
      repository = new Decorated(api, Model)
    })

    it('adds #find(id, query)', () => {
      expect(repository).to.respondTo('find')
    })

    it('calls api#read with resource and default query', () => {
      api.read.returns(Promise.resolve())
      repository.find(1)
      expect(api.read)
        .to.have.been.calledWithExactly('test/1', undefined, undefined)
    })

    it('calls api#read with resource and passed query', () => {
      const query = {}
      api.read.returns(Promise.resolve())
      repository.find(1, query)
      expect(api.read)
        .to.have.been.calledWithExactly('test/1', undefined, query)
    })

  })

  describe('@saveable', () => {

    let api, repository

    beforeEach(() => {
      @saveable
      class Decorated extends Repository {
        constructor() {
          super(...arguments)
          this.path = 'test'
        }
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
          .to.have.been.calledWithExactly('test', {}, undefined)
      })
    })

    context('when model has an #id', () => {
      it('calls api#update with model#data', () => {
        api.update = sinon.stub().returns(Promise.resolve())
        const model = new Model({ id: 1 })
        repository.save(model)
        expect(api.update)
          .to.have.been.calledWithExactly('test/1', { id: 1 }, undefined)
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
          .to.have.been.calledWithExactly('test', data, undefined)
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

  describe('@searchable', () => {

    let api, repository

    beforeEach(() => {
      @searchable
      class Decorated extends Repository {
        constructor() {
          super(...arguments)
          this.path = 'test'
        }
      }
      api = { read: sinon.stub() }
      repository = new Decorated(api, Model)
    })

    it('adds #search(query)', () => {
      expect(repository).to.respondTo('search')
    })

    it('calls api#read with default query', () => {
      api.read.returns(Promise.resolve())
      repository.search()
      expect(api.read)
        .to.have.been.calledWithExactly('test', undefined, undefined)
    })

    it('calls api#read with passed query', () => {
      const query = {}
      api.read.returns(Promise.resolve())
      repository.search(query)
      expect(api.read)
        .to.have.been.calledWithExactly('test', undefined, query)
    })

  })

  describe('@destroyable', () => {

    let api, repository

    beforeEach(() => {
      @destroyable
      class Decorated extends Repository {
        constructor() {
          super(...arguments)
          this.path = 'test'
        }
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
          .to.have.been.calledWithExactly('test/1', {})
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
            models.forEach(model => expect(model.data).to.deep.equal({}))
          })
      })
    })

  })

})
