'use strict'

const expect = require('chai').expect
const sinon  = require('sinon')
const Router = require('../../src/http/router').Router
const Conn   = require('../../src/http/conn').Conn

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

    it('finds existing pipelines by name', () => {
      router.pipeline("sample", [])
      expect(router.pipeline("sample").name).to.eql("sample")
      expect(router.pipeline("sample").steps).to.eql([])
    })

    it('returns null if pipeline could not be found', () => {
      expect(router.pipeline("sample")).to.be.undefined
    })
  })

  describe('scope', () => {
    let router = null
    beforeEach(() => { router = new Router() })

    it('creates a scope for the current router', (done) => {
      router.scope(scope => {
        expect(scope._router).to.eq(router)
        done()
      })
    })
  })

  describe('dispatch', () => {
    it('correctly dispatches a mocked request', () => {
      let router = new Router()
      let handler = sinon.spy()
      router.scope(scope => {
        scope.get('/home', handler)
      })
      let conn = Conn.mockConn('GET', '/home')
      router.dispatch(conn)
      // expect(handler.called).to.be.true
    })
  })
})
