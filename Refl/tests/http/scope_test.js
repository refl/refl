'use strict'

const expect = require('chai').expect
const Scope = require('../../src/http/scope').Scope

describe('Scope specs', () => {
  it('is a function class', () => {
    expect(Scope).to.be.a('function')
    let scope = new Scope()
    expect(scope).to.be.ok
  })

  describe('prefix', () => {
    let scope
    beforeEach(() => { scope = new Scope() })

    it('specifies a prefix to the scope', () => {
      expect(scope.getPrefix()).to.eq('')
      expect(scope.hasPrefix()).to.be.false
      scope.prefix('/something')
      expect(scope.getPrefix()).to.eq('/something')
      expect(scope.hasPrefix()).to.be.true
    })

    it('raises an error if a prefix was already specified', () => {
      let bindPrefix = () => { scope.prefix('/something') }
      expect(bindPrefix).not.to.throw(/already specified/)
      expect(bindPrefix).to.throw(/already specified/)
    })

    it('inherits parent scope prefix if nested')
  })

  describe('pipeline', () => {
    it('inherits parent scope pipeline if nested')
  })
})
