'use strict'

const expect = require('chai').expect
const Refl = require('../src/refl')

describe('Refl specs', () => {
  it('is an object', () => {
    expect(Refl).to.be.an('object')
  })
})