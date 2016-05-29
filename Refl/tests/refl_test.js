'use strict'

const expect = require('chai').expect
const Refl = require('../src/refl')
const Initializer = require('../src/app/initializer')

describe('Refl specs', () => {
  it('is an object', () => {
    expect(Refl).to.be.an('object')
  })

  describe('.app', () => {
    beforeEach(() => { 
      return Initializer.clearAllApps() 
    })

    it('creates a new app if a config is specified', () => {
      return Refl.app('MyApp', {})
        .then(app => {
          expect(app.name).to.eq('MyApp')
        })
    })

    it('returns existing app if a config is not specified', () => {
      return Refl.app('MyApp', {})
        .then(app => {
          expect(Refl.app('MyApp')).to.eq(app)
        })
    })

    it('returns undefined if the app wasnt defined', () => {
      expect(Refl.app('MyApp')).to.be.undefined
    })
  })
})