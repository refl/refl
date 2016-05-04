'use strict'

const expect = require('chai').expect
const Scope = require('../../src/http/scope').Scope
const Router = require('../../src/http/router').Router

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
      scope.get('/home', conn => {
      })
    })

    it('registers a POST route')
    it('registers a PUT route')
    it('registers a PATCH route')
    it('registers a DELETE route')
  })
})
