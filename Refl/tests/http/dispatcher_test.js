'use strict'

const expect = require('chai').expect
const sinon  = require('sinon')
const Dispatcher = require('../../src/http/dispatcher').Dispatcher

describe('Dispatcher specs', () => {
  it('is a function', () => {
    expect(Dispatcher).to.be.a('function')
    let dispatcher = new Dispatcher()
    expect(dispatcher).to.be.ok
    expect(dispatcher.routes).to.eql([])
  })

  describe('#register and #dispatch', () => {
    let dispatcher = null
    beforeEach(() => { dispatcher = new Dispatcher() })

    it('registers and dispatches a route without variables', () => {
      let handler = sinon.spy()
      dispatcher.register('GET', '/my/path', handler)
      dispatcher.dispatch('GET', '/my/path')
      expect(handler.called).to.be.true
    })

    it('calls only the first registered route', () => {
      let handler1 = sinon.spy()
      let handler2 = sinon.spy()
      dispatcher.register('GET', '/home', handler1)
      dispatcher.register('GET', '/home', handler2)
      dispatcher.dispatch('GET', '/home')
      expect(handler1.called).to.be.true
      expect(handler2.called).to.be.false
    })

    it('calls the route with the same HTTP method', () => {
      let handler1 = sinon.spy()
      let handler2 = sinon.spy()
      dispatcher.register('GET', '/home', handler1)
      dispatcher.register('PUT', '/home', handler2)
      dispatcher.dispatch('PUT', '/home')
      expect(handler1.called).to.be.false
      expect(handler2.called).to.be.true
    })

    it('matches routes with named params', () => {
      let handler = sinon.spy()
      dispatcher.register('GET', '/users/:id', handler)
      dispatcher.dispatch('GET', '/users/10')
      expect(handler.called).to.be.true
    })

    it('calls the handler with named params', () => {
      let handler = (params) => {
        expect(params).to.eql({ id: '10' })
      }
      dispatcher.register('GET', '/users/:id', handler)
      dispatcher.dispatch('GET', '/users/10')
    })

    it('calls the handler with multiple params', () => {
      let handler = (params) => {
        expect(params).to.eql({ user_id: '10', comment_id: '15' })
      }
      dispatcher.register('GET', '/users/:user_id/comments/:comment_id', handler)
      dispatcher.dispatch('GET', '/users/10/comments/15')
    })

    it('raises an error if multiple params have the same name', () => {
      let registerFn = () => {
        dispatcher.register('GET', '/users/:id/comments/:id', () => {})
      }
      expect(registerFn).to.throw(/same name/)
    })

    it('matches the first route considering named params', () => {
      let handler1 = sinon.spy()
      let handler2 = sinon.spy()
      dispatcher.register('GET', '/users/:id', handler1)
      dispatcher.register('GET', '/users/luiz', handler2)
      dispatcher.dispatch('GET', '/users/luiz')
      expect(handler1.called).to.be.true
      expect(handler2.called).to.be.false
    })
  })
})
