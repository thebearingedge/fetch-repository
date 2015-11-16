
import chai from 'chai'
import sinonChai from 'sinon-chai'
import Repository from '../src/repository'

chai.use(sinonChai)

const { expect } = chai

describe('Repository', () => {

  describe('constructor(api, Model)', () => {

    it('stores a reference to each argument', () => {
      const api = {}
      class Model {}
      const repository = new Repository(api, Model)
      expect(repository.api).to.equal(api)
      expect(repository.Model).to.equal(Model)
      expect(repository.resource).to.equal(null)
    })

  })

})
