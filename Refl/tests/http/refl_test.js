const expect = require('chai').expect
const Refl = require('../../src/http/refl').Refl

describe('Refl specs', () => {
  it('is an object', () => {
    expect(Refl).to.be.an('object')
  })
})
