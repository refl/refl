const expect      = require('chai').expect
const Initializer = require('../../src/app/initializer')

describe('initializer specs', () => {
  it('is an object', () => {
    expect(Initializer).to.be.an('object')
  })

  describe('initializeApp', () => {
    beforeEach(() => {
      Initializer.clearAllApps()
    })
    
    it('returns a promise that resolves with the app with the given name', () => {
      return Initializer.initializeApp('MyApp')
        .then(app => {
          expect(app.name).to.eq('MyApp')
        })
    })

    it('rejects the promise if the app name already exists', () => {
      return Initializer.initializeApp('MyApp')
        .then(app => {
          return Initializer.initializeApp('MyApp')
        })
        .catch(err => {
          expect(err).to.match(/already exists/)
        })
    })

    it('has a router object', () => {
      return Initializer.initializeApp('MyApp')
        .then(app => {
          expect(app.router).to.be.ok
        })
    })
  })
})