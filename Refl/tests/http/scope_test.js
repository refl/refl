'use strict'

const expect = require('chai').expect
const Scope  = require('../../src/http/scope').Scope
const Router = require('../../src/http/router').Router
const sinon  = require('sinon')
const Conn   = require('../../src/http/conn').Conn
const _      = require('lodash')


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

  describe('pipeline', () => {
    it('generates an anonymous pipeline if an array of function is provided', () => {
      let router = new Router()
      let scope = new Scope(router)
      let handler1 = sinon.spy()
      expect(_.keys(router.pipelines)).to.have.length(0)
      scope.pipeThrough([handler1])
      expect(_.keys(router.pipelines)).to.have.length(1)
      expect(_.keys(router.pipelines)[0]).to.match(/pipeline_/)
    })
  })

  describe('nest (group)', () => {
    it('inherits parent prefix', (done) => {
      let scope = new Scope()
      scope.prefix('/foo')
      scope.nest(scope => {
        scope.prefix('/bar')
          expect(scope.prefix()).to.eq('/foo/bar')
        done()
      })
    })
    
    it('inherits parent + parents parent prefix (cascading)', (done) => {
      let scope = new Scope()
      scope.prefix('/foo')
      scope.group(scope => {
        scope.prefix('/bar')
        scope.group(scope => {
          scope.prefix('/qux')
          expect(scope.prefix()).to.eq('/foo/bar/qux')
          done()
        })
      })
    })

    it('throws an error if the scope doesnt have a router', () => {
      let createScope = () => {
        let scope = new Scope()
        scope.pipeThrough('web')
      }
      expect(createScope).to.throw(/router/)
    })

    it('throws an error if the router doesnt have the given pipeline', () => {
      let router = new Router()
      let scope = new Scope(router)
      let fn = () => { scope.pipeThrough('web') }
      expect(fn).to.throw(/not found/)
    })

    it('inherits parent pipeline', (done) => {
      let router = new Router()
      router.pipeline('web', [])
      router.pipeline('some', [])
      let scope = new Scope(router)
      scope.pipeThrough('web')
      scope.nest(scope => {
        scope.pipeThrough('some')
        expect(scope.pipesThrough()).to.eql(['web', 'some'])
        done()
      })
    })

    it('inherits parent + parents parent pipeline (cascading)', (done) => {
      let router = new Router()
      router.pipeline('web', [])
      router.pipeline('dog', [])
      router.pipeline('cat', [])
      let scope = new Scope(router)
      scope.pipeThrough('web')
      scope.nest(scope => {
        scope.pipeThrough('dog')
        scope.nest(scope => {
          scope.pipeThrough('cat')
          expect(scope.pipesThrough()).to.eql(['web', 'dog', 'cat'])
          done()
        })
      })
    })
  })

  describe('routing and dispatching', () => {
    let scope, router
    beforeEach(() => {
      router = new Router()
      scope = new Scope(router)
    })

    it.only('registers a GET route', () => {
      let handler = sinon.spy()
      scope.get('/home', handler)
      router.dispatch(Conn.mockConn('GET', '/home'))
      expect(handler.called).to.be.true
    })

    it('registers a POST route', () => {
      let handler = sinon.spy()
      scope.post('/home', handler)
      router.dispatch(Conn.mockConn('POST', '/home'))
      expect(handler.called).to.be.true
    })

    it('registers a PUT route', () => {
      let handler = sinon.spy()
      scope.put('/home', handler)
      router.dispatch(Conn.mockConn('PUT', '/home'))
      expect(handler.called).to.be.true
    })

    it('registers a PATCH route', () => {
      let handler = sinon.spy()
      scope.patch('/home', handler)
      router.dispatch(Conn.mockConn('PATCH', '/home'))
      expect(handler.called).to.be.true
    })

    it('registers a DELETE route', () => {
      let handler = sinon.spy()
      scope.delete('/home', handler)
      router.dispatch(Conn.mockConn('DELETE', '/home'))
      expect(handler.called).to.be.true
    })

    it('registers a route with the scope prefix', () => {
      scope.prefix('/cat')
      let handler = sinon.spy()
      scope.get('/home', handler)
      router.dispatch(Conn.mockConn('GET', '/cat/home'))
      expect(handler.called).to.be.true
    })

    it('registers a route with nested scope prefix', () => {
      scope.prefix('/cat')
      let handler = sinon.spy()
      scope.group(scope => {
        scope.prefix('/dog')
        scope.get('/home', handler)
      })
      router.dispatch(Conn.mockConn('GET', '/cat/dog/home'))
      expect(handler.called).to.be.true
    })

    it('calls the scope pipeline prior to the route handler', () => {
      let step1 = sinon.spy((conn, next) => { next(conn) })
      let step2 = sinon.spy((conn, next) => { next(conn) })
      let handler = sinon.spy()
      scope.pipeThrough([step1, step2])
      scope.get('/home', handler)
      router.dispatch(Conn.mockConn('GET', '/home'))
      expect(step1.called).to.be.true
      expect(step2.called).to.be.true
      expect(handler.called).to.be.true
    })

    it('calls the parents scope pipeline prior to the nested pipeline')
  })
})
