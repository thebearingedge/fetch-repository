
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import Model from '../src/model'
import Repository from '../src/repository'
import { findById, save, list, destroy } from '../src/decorators'

chai.use(sinonChai)

const { expect } = chai
let api

beforeEach(() => {
  const methods = [ 'get', 'put', 'post', 'patch', 'delete' ]
  api = methods.reduce((api, method) => {
    return Object.assign(api, { [method]: sinon.stub() })
  }, {})
})

describe('@findById(id, { $returning })', () => {

  let sut

  beforeEach(() => {
    @findById
    class TestRepository extends Repository {}
    sut = new TestRepository(api, Model)
    sut.path = 'test'
  })

  it('adds #findById', () => {
    expect(sut.findById).to.be.ok
  })

  it('calls api#get with resource and default query', () => {
    api.get.returns(Promise.resolve())
    sut.findById(1)
    expect(api.get)
      .to.have.been.calledWithExactly('test/1', undefined, { $returning: {} })
  })

  it('calls api#get with resource and passed query', () => {
    const query = { $returning: { columns: ['foo'] } }
    api.get.returns(Promise.resolve())
    sut.findById(1, query)
    expect(api.get)
      .to.have.been.calledWithExactly('test/1', undefined, query)
  })

})

describe('@save(model, { $returning })', () => {

  const $returning = {}
  let sut

  beforeEach(() => {
    @save
    class TestRepository extends Repository {}
    sut = new TestRepository(api, Model)
    sut.path = 'test'
  })

  it('adds #save', () => {
    expect(sut.save).to.be.ok
  })

  context('when model has no #id', () => {
    it('calls api#post with model#json', () => {
      api.post.returns(Promise.resolve())
      const model = new Model({})
      sut.save(model)
      expect(api.post)
        .to.have.been.calledWithExactly('test', {}, { $returning })
    })
  })

  context('when model has an #id', () => {
    it('calls api#put with model#json', () => {
      api.put.returns(Promise.resolve())
      const model = new Model({ id: 1 })
      sut.save(model)
      expect(api.put)
        .to.have.been.calledWithExactly('test/1', { id: 1 }, { $returning })
    })
  })

  context('when (model) has an #id', () => {
    context('and (options) #patch is true', () => {
      it('calls api#patch with model#json', () => {
        api.patch.returns(Promise.resolve())
        const model = new Model({ id: 1 })
        sut.save(model, { patch: true })
        expect(api.patch)
          .to.have.been.calledWithExactly('test/1', { id: 1 }, { $returning })
      })
    })
  })

})

describe('@list({ $returning }', () => {

  let sut

  beforeEach(() => {
    @list
    class TestRepository extends Repository {}
    sut = new TestRepository(api, Model)
    sut.path = 'test'
  })

  it('adds #list', () => {
    expect(sut.list).to.be.ok
  })

  it('calls api#get with default query', () => {
    api.get.returns(Promise.resolve())
    sut.list()
    expect(api.get).to.have.been.calledWithExactly('test', undefined, {})
  })

  it('calls api#get with passed query', () => {
    const query = { $search: 'foo', $returning: {} }
    api.get.returns(Promise.resolve())
    sut.list(query)
    expect(api.get).to.have.been.calledWithExactly('test', undefined, query)
  })

})

describe('@destroy(model)', () => {

  let sut

  beforeEach(() => {
    @destroy
    class TestRepository extends Repository {}
    sut = new TestRepository(api, Model)
    sut.path = 'test'
  })

  it('adds #destroy', () => {
    expect(sut.destroy).to.be.ok
  })

  context('when (model) has an #id', () => {
    it('calls api#delete', () => {
      api.delete.returns(Promise.resolve())
      const model = new Model({ id: 1 })
      sut.destroy(model)
      expect(api.delete)
        .to.have.been.calledWithExactly('test/1')
    })
  })

  context('when (model) does not have an #id', () => {
    it('resolves a fresh instance of the model', () => {
      api.delete.returns(Promise.resolve())
      const model = new Model()
      return sut.destroy(model)
        .then(fresh => {
          expect(api.delete.called).to.equal(false)
          expect(fresh).not.to.equal(model)
          expect(fresh instanceof Model).to.equal(true)
        })
    })
  })

})
