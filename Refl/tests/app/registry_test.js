const expect = require('chai').expect
const Registry = require('../../src/app/registry')

describe('Registry specs', () => {
  it('is an object', () => {
    expect(Registry).to.be.an('object')
  })
})