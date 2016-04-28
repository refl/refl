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
      expect(scope.prefix()).to.eq('')
      expect(scope.hasPrefix()).to.be.false
      scope.prefix('/something')
      expect(scope.prefix()).to.eq('/something')
      expect(scope.hasPrefix()).to.be.true
    })

    it('raises an error if a prefix was already specified', () => {
      let bindPrefix = () => { scope.prefix('/something') }
      expect(bindPrefix).not.to.throw(/already specified/)
      expect(bindPrefix).to.throw(/already specified/)
    })
  })

  describe('nest', () => {
    it('inherits parent prefix', () => {
      let scope = new Scope()
      scope.prefix('/foo')
      scope.nest(scope => {
        scope.prefix('/bar')
        expect(scope.prefix()).to.eq('/foo/bar')
      })
    })

    it('inherits parent + parents parent prefix (cascading)')

    it('inherits parent pipeline')
    it('inherits parent + parents parent pipeline (cascading)')
  })
})
