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

  it('stores a reference to the app it belongs', () => {
    let app = {} // mocked app, doesn't really matter
    let router = new Router(app)
    expect(router.app).to.eq(app)
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
        expect(scope._router).to.eq(router) // we prefix private attrs with "_"
        done()
      })
    })
  })

  describe('dispatch', () => {
    it('dispatches a mocked request', () => {
      let router = new Router()
      let handler = sinon.spy()
      router.scope(scope => {
        scope.get('/home', handler)
      })
      let conn = Conn.mockConn('GET', '/home')
      return router.dispatch(conn)
        .then(arg => {
          expect(handler.called).to.be.true
        })
    })

    it('dispatches a request to the correct HTTP method', () => {
      let router = new Router()
      let getHandler = sinon.spy()
      let postHandler = sinon.spy()
      router.scope(scope => {
        scope.get('/home', getHandler)
        scope.post('/home', postHandler)
      })
      return router.dispatch(Conn.mockConn('POST', '/home'))
        .then(arg => {
          expect(getHandler.called).to.be.false
          expect(postHandler.called).to.be.true
        })
    })
  })

  describe('#reset', () => {
    it('resets existing routes', () => {
      let router = new Router
      router.scope(scope => {
        scope.get('/home', function() {})
        scope.get('/else', function() {})
      })
      expect(router.dispatcher.routes).to.have.length(2)
      router.reset()
      expect(router.dispatcher.routes).to.have.length(0)
    })

    it('resets existing pipelines', () => {
      let router = new Router()
      router.pipeline('my-pipeline', [])
      expect(router.pipeline('my-pipeline')).to.be.ok
      router.reset()
      expect(router.pipeline('my-pipeline')).not.to.be.ok
      
      // defining the same pipeline doesn't raise
      router.pipeline('my-pipeline', [])
    })
  })
})
