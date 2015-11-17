
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

beforeEach(() => {
  const methods = [ 'get', 'put', 'post', 'patch', 'delete' ]
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

  it('calls api#get with resource and default query', () => {
    api.get.returns(Promise.resolve())
    repository.find(1)
    expect(api.get)
      .to.have.been.calledWithExactly('test/1', undefined, undefined)
  })

  it('calls api#get with resource and passed query', () => {
    const query = {}
    api.get.returns(Promise.resolve())
    repository.find(1, query)
    expect(api.get)
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
    it('calls api#post with model#json', () => {
      api.post.returns(Promise.resolve())
      const model = new Model()
      repository.save(model)
      expect(api.post)
        .to.have.been.calledWithExactly('test', {}, undefined)
    })
  })

  context('when model has an #id', () => {
    it('calls api#put with model#json', () => {
      api.put.returns(Promise.resolve())
      const model = new Model({ id: 1 })
      repository.save(model)
      expect(api.put)
        .to.have.been.calledWithExactly('test/1', { id: 1 }, undefined)
    })
  })

  context('when (model) has an #id', () => {
    context('and (query) #patch is true', () => {
      it('calls api#patch with model#json', () => {
        api.patch.returns(Promise.resolve())
        const model = new Model({ id: 1 })
        repository.save(model, {}, { patch: true })
        expect(api.patch)
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

  it('calls api#get with default query', () => {
    api.get.returns(Promise.resolve())
    repository.search()
    expect(api.get)
      .to.have.been.calledWithExactly('test', undefined, undefined)
  })

  it('calls api#get with passed query', () => {
    const query = {}
    api.get.returns(Promise.resolve())
    repository.search(query)
    expect(api.get)
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
    it('calls api#delete', () => {
      api.delete.returns(Promise.resolve())
      const model = new Model({ id: 1 })
      repository.destroy(model)
      expect(api.delete)
        .to.have.been.calledWithExactly('test/1')
    })
  })

  context('when (model) does not have an #id', () => {
    it('resolves a fresh instance of #Model', () => {
      api.delete.returns(Promise.resolve())
      const model = new Model()
      return repository.destroy(model)
        .then(fresh => {
          expect(api.delete).not.to.have.been.called
          expect(fresh).not.to.equal(model)
          expect(fresh).to.be.instanceOf(Model)
        })
    })
  })

})
