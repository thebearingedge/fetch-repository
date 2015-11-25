
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
    api = {}
    const actions = [ 'read', 'replace', 'create', 'update', 'destroy' ]
    actions.forEach(action => api[action] = sinon.stub())
  })

  describe('create(data)', () => {

    let repository, SpyModel

    beforeEach(() => {
      SpyModel = sinon.spy()
      class TestRepository extends Repository {
        constructor(api) { super(api) }
        get Model() { return SpyModel }
      }
      repository = new TestRepository(api)
    })

    context('when (data) is not an Array', () => {
      it('instantiates the base Model with (data)', () => {
        const data = {}
        const model = repository.create(data)
        expect(SpyModel).to.have.been.calledWithExactly(data)
        expect(model).to.be.instanceOf(SpyModel)
      })
    })

    context('when (data) is an array', () => {
      it('instantiates an array of base models', () => {
        const data = [{}, {}]
        const models = repository.create(data)
        expect(models).to.be.instanceOf(Array)
        models.forEach(model => {
          expect(model).to.be.instanceOf(SpyModel)
        })
      })
    })

  })


  describe('sync(action, path, payload, query)', () => {

    let repository

    beforeEach(() => repository = new Repository(api, Model))

    it('calls (action) on #api with (...args)', () => {
      api.read.returns(Promise.resolve())
      const args = ['test', {}, {}]
      return repository.sync('read', ...args)
        .then(() => {
          expect(api.read).to.have.been.calledWithExactly('test', {}, {})
        })
    })

  })

  describe('serialize(model)', () => {

    it('returns (model)#data', () => {
      class TestRepository extends Repository {
        constructor(api) { super(api) }
        get Model() { return Model }
      }
      const repository = new TestRepository(api)
      const model = repository.create()
      const data = repository.serialize(model)
      expect(data).to.deep.equal(model.data)
    })

  })

})
