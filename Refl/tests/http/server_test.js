'use strict'

const expect = require('chai').expect
const HTTPServer = require('../../src/http/server').HTTPServer
const Conn = require('../../src/http/conn').Conn
const Router = require('../../src/http/router').Router

describe('HTTPServer specs', () => {
  it('is a function class', () => {
    expect(HTTPServer).to.be.a('function')
    let server = new HTTPServer()
    expect(server).to.be.an('object')
  })

  describe('#handleRequest', () => {
    let router, server
    beforeEach(() => {
      router = new Router
      server = new HTTPServer(router)
    })

    it('calls the `end` function with the content from the handler', () => {
      let req = Conn.mockRequest('GET', '/home')
      let res = Conn.mockResponse()
      router.scope(scope => {
        scope.get('/home', conn => {
          return conn.json({ hello: "world" })
        })
      })

      return server.handleRequest(req, res)
        .then(arg => {
          expect(res._body).to.eq('{"hello":"world"}')
        })
    })

    it('stringifies the content if the handler returns an object', () => {
      router.scope(scope => {
        scope.get('/home', conn => {
          return { hello: "world" }
        })
      })

      let conn = Conn.mockConn('GET', '/home')
      return server.handleRequest(conn.req, conn.res)
        .then(arg => {
          expect(conn.res._body).to.eq('{"hello":"world"}')
        })
    })

    it('assigns the conn statusCode to the response object', () => {
      router.scope(scope => {
        scope.get('/home', conn => {
          return "hello"
        })
      })

      let conn = Conn.mockConn('GET', '/home')
      return server.handleRequest(conn.req, conn.res)
        .then(arg => {
          expect(conn.res.statusCode).to.eq(conn.statusCode)
        })
    })

    it('reponds with status stored in the conn', () => {
      router.scope(scope => {
        scope.get('/home', conn => {
          return conn.status(280)
        })
      })

      let conn = Conn.mockConn('GET', '/home')
      return server.handleRequest(conn.req, conn.res)
        .then(arg => {
          expect(conn.res.statusCode).to.eq(280)
        })
    })
  })
})