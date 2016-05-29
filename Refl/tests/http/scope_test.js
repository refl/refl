'use strict'

const expect = require('chai').expect
const Scope  = require('../../src/http/scope').Scope
const Router = require('../../src/http/router').Router
const sinon  = require('sinon')
const Conn   = require('../../src/http/conn').Conn
const App    = require('../../src/app/app').App
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

    it('registers a GET route', () => {
      let handler = sinon.spy()
      scope.get('/home', handler)
      return router.dispatch(Conn.mockConn('GET', '/home'))
        .then(arg => {
          expect(handler.called).to.be.true
        })
    })

    it('registers a POST route', () => {
      let handler = sinon.spy()
      scope.post('/home', handler)
      return router.dispatch(Conn.mockConn('POST', '/home'))
        .then(arg => {
          expect(handler.called).to.be.true
        })
    })

    it('registers a PUT route', () => {
      let handler = sinon.spy()
      scope.put('/home', handler)
      return router.dispatch(Conn.mockConn('PUT', '/home'))
        .then(arg => {
          expect(handler.called).to.be.true
        })
    })

    it('registers a PATCH route', () => {
      let handler = sinon.spy()
      scope.patch('/home', handler)
      return router.dispatch(Conn.mockConn('PATCH', '/home'))
        .then(arg => {
          expect(handler.called).to.be.true
        })
    })

    it('registers a DELETE route', () => {
      let handler = sinon.spy()
      scope.delete('/home', handler)
      return router.dispatch(Conn.mockConn('DELETE', '/home'))
        .then(arg => {
          expect(handler.called).to.be.true
        })
    })

    it('registers a route with an action string', () => {
      let app = new App('MyApp')
      router.app = app
      app.controller('PagesController', {
        home: conn => { return conn.set("hello", "world") }
      })
      scope.get('/home', 'PagesController@home')
      return router.dispatch(Conn.mockConn('GET', '/home'))
        .then(conn => {
          expect(conn.get('hello')).to.eq('world')
        })
    })

    it('throws an error if the given action string wasnt found', () => {
      let app = new App('MyApp')
      router.app = app
      let registerRoute = () => { scope.get('/home', 'PagesController@home') }
      expect(registerRoute).to.throw(/not found/)
    })

    it('throws an error if the handler isnt a function or action', () => {
      let registerRoute = () => { scope.get('/home', null) }
      expect(registerRoute).to.throw(/handler must be either a function or an action/)
    })

    it('returns a promise that resolves with the return value from the handler', () => {
      let handler = conn => { return conn.json({hello: "world"}) }
      scope.get('/home', handler)
      return router.dispatch(Conn.mockConn('GET', '/home'))
        .then(res => {
          expect(res).to.eq('{\"hello\":\"world\"}')
        })
    })

    it('returns a promise that resolves with a value returned directly from the handler', () => {
      let handler = conn => { return { hello: "world" } }
      scope.get('/home', handler)
      return router.dispatch(Conn.mockConn('GET', '/home'))
        .then(arg => {
          expect(arg).to.eql({hello: "world"}) // not serialized yet.
        })
    })

    it('registers a route with the scope prefix', () => {
      scope.prefix('/cat')
      let handler = sinon.spy()
      scope.get('/home', handler)
      return router.dispatch(Conn.mockConn('GET', '/cat/home'))
        .then(arg => {
          expect(handler.called).to.be.true
        })
    })

    it('registers a route with nested scope prefix', () => {
      scope.prefix('/cat')
      let handler = sinon.spy()
      scope.group(scope => {
        scope.prefix('/dog')
        scope.get('/home', handler)
      })
      return router.dispatch(Conn.mockConn('GET', '/cat/dog/home'))
        .then(arg => {
          expect(handler.called).to.be.true
        })
    })

    it('calls the scope pipeline prior to the route handler', () => {
      let step1 = sinon.spy(conn => { return Promise.resolve(conn) })
      let step2 = sinon.spy(conn => { return Promise.resolve(conn) })
      let handler = sinon.spy()
      scope.pipeThrough([step1, step2])
      scope.get('/home', handler)
      return router.dispatch(Conn.mockConn('GET', '/home'))
        .then(arg => {
          expect(step1.called).to.be.true
          expect(step2.called).to.be.true
          expect(handler.called).to.be.true
        })
    })

    it('calls the parents scope pipeline prior to the nested pipeline', () => {
      let step1 = conn => { return conn.set('num', conn.get('num') + 3) }
      let step2 = conn => { return conn.set('num', conn.get('num') * 2) }
      scope.pipeThrough([step1])
      scope.group(scope => {
        scope.pipeThrough([step2])
        scope.get('/home', conn => { return conn })
      })

      let conn = Conn.mockConn('GET', '/home').set('num', 1)
      return router.dispatch(conn)
        .then(conn => {
          expect(conn.get('num')).to.eq((1 + 3) * 2)
        })
    })
  })
})
