'use strict'

const expect = require('chai').expect
const sinon  = require('sinon')
const Router = require('../../src/http/router').Router

describe('Router specs', () => {
  it('is a class', () => {
    expect(Router).to.be.a('function')
    expect(new Router()).to.be.ok
  })

  describe('pipeline', () => {
    let router = null
    beforeEach(() => { router = new Router() })

    it('raises an error if there is already a pipeline with the given name', () => {
      router.pipeline("sample", [])
      let registerSame = () => { router.pipeline("sample", []) }
      expect(registerSame).to.throw(/pipeline already registered/)
    })

    it('raises an error if the pipeline has invalid steps', () => {
      let fn = () => { router.pipeline("sample", [10]) }
      expect(fn).to.throw(/invalid/)
    })
  })

  describe('scope', () => {
    let router = null
    beforeEach(() => { router = new Router() })

    it('creates a scope with a prefix')
    it('creates a scope with a pipeline')
  })
})
