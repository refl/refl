const expect      = require('chai').expect
const Initializer = require('../../src/app/initializer')
const Refl        = require('../../src/refl')
const Registry    = require('../../src/app/registry')
const _           = require('lodash')

describe('initializer specs', () => {
  it('is an object', () => {
    expect(Initializer).to.be.an('object')
  })

  describe('initializeApp', () => {
    beforeEach(() => {
      return Initializer.clearAllApps()
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

  describe('.load', () => {
    beforeEach(() => {
      return Initializer.clearAllApps()
    })

    it('stores a reference to the entry script in the refl object', () => {
      return Initializer.initializeApp('MyApp')
        .then(app => {
          expect(Registry.countEntries()).to.eq(0)
          app.load(require.resolve('../resources/app1.js'))
          expect(Registry.countEntries()).to.eq(1)
          expect(Registry.getApp(require.resolve('../resources/app1.js'))).to.eq(app)
        })
    })

    it('throws an error if entry script doesnt export a function', () => {
      return Initializer.initializeApp('MyApp')
        .then(app => {
          app.load(require.resolve('../resources/app2.js'))
        })
        .catch(err => {
          expect(err).to.match(/exported as a function/)
        })
    })
  })
})