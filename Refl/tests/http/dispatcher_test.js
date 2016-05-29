'use strict'

const expect     = require('chai').expect
const sinon      = require('sinon')
const Conn       = require('../../src/http/conn').Conn
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
      dispatcher.match('GET', '/my/path', handler)
      dispatcher.dispatch(Conn.mockConn('GET', '/my/path'))
      expect(handler.called).to.be.true
    })

    it('calls only the first registered route', () => {
      let handler1 = sinon.spy()
      let handler2 = sinon.spy()
      dispatcher.match('GET', '/home', handler1)
      dispatcher.match('GET', '/home', handler2)
      dispatcher.dispatch(Conn.mockConn('GET', '/home'))
      expect(handler1.called).to.be.true
      expect(handler2.called).to.be.false
    })

    it('calls the route with the same HTTP method', () => {
      let handler1 = sinon.spy()
      let handler2 = sinon.spy()
      dispatcher.match('GET', '/home', handler1)
      dispatcher.match('PUT', '/home', handler2)
      dispatcher.dispatch(Conn.mockConn('PUT', '/home'))
      expect(handler1.called).to.be.false
      expect(handler2.called).to.be.true
    })

    it('matches routes with named params', () => {
      let handler = sinon.spy()
      dispatcher.match('GET', '/users/:id', handler)
      dispatcher.dispatch(Conn.mockConn('GET', '/users/10'))
      expect(handler.called).to.be.true
    })

    it('stores path params in the pathParams object', () => {
      let handler = (conn) => {
        expect(conn.pathParams).to.eql({ id: '10' })
      }
      dispatcher.match('GET', '/users/:id', handler)
      dispatcher.dispatch(Conn.mockConn('GET', '/users/10'))
    })

    it('store path params for multiple attributes', (done) => {
      let handler = (conn) => {
        expect(conn.pathParams).to.eql({ user_id: '10', comment_id: '15' })
        done()
      }
      dispatcher.match('GET', '/users/:user_id/comments/:comment_id', handler)
      dispatcher.dispatch(Conn.mockConn('GET', '/users/10/comments/15'))
    })

    it('merges path params in the params hash', () => {
      let handler = conn => {
        expect(conn.params).to.eql({id: '10', color: 'blue'})
      }
      dispatcher.match('GET', '/users/:id', handler)
      dispatcher.dispatch(Conn.mockConn('GET', '/users/10?color=blue'))
    })

    it('raises an error if multiple params have the same name', () => {
      let registerFn = () => {
        dispatcher.match('GET', '/users/:id/comments/:id', () => {})
      }
      expect(registerFn).to.throw(/same name/)
    })

    it('matches the first route considering named params', () => {
      let handler1 = sinon.spy()
      let handler2 = sinon.spy()
      dispatcher.match('GET', '/users/:id', handler1)
      dispatcher.match('GET', '/users/luiz', handler2)
      dispatcher.dispatch(Conn.mockConn('GET', '/users/luiz'))
      expect(handler1.called).to.be.true
      expect(handler2.called).to.be.false
    })

    it('rejects the promise and assgins 404 to the conn if no route was found', () => {
      let conn = Conn.mockConn('GET', '/something')
      return dispatcher.dispatch(conn)
        .catch(err => {
          expect(conn.statusCode).to.eq(404)
          expect(err).to.match(/route not found/)
        })
    })
  })

  describe('#reset', () => {
    it('removes existing routes', () => {
      let dispatcher = new Dispatcher
      dispatcher.match('GET', '/home', function() {})
      expect(dispatcher.routes).to.have.length(1)
      dispatcher.reset()
      expect(dispatcher.routes).to.have.length(0)
    })
  })
})
