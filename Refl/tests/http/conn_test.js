'use strict'

const expect = require('chai').expect
const Conn = require('../../src/http/conn').Conn

describe('Conn specs', () => {
  it('is an object', () => {
    expect(Conn).to.be.an('object')
  })

  describe('.mockRequest', () => {
    it('accepts method and path as arguments', () => {
      let req = Conn.mockRequest('GET', '/home')
      expect(req.method).to.eq('GET')
      expect(req.url).to.eq('/home')
    })

    it('accepts a json body as the third argument')
  })

  describe('.mockResponse', () => {
    it('generates a valid object', () => {
      let res = Conn.mockResponse()
      expect(res).to.be.ok
    })

    it('implements the `send` function', () => {
      let res = Conn.mockResponse()
      expect(res.send).to.be.a('function')
    })
  })

  describe('.mockConn', () => {
    it('generates valid object', () => {
      let conn = Conn.mockConn('GET', '/home')
      expect(conn).to.be.ok
    })

    it('stores the given method and path in the request', () => {
      let conn = Conn.mockConn('GET', '/home')
      expect(conn.req.method).to.eq('GET')
      expect(conn.req.url).to.eq('/home')
    })

    it('stores the given method in the conn object', () => {
      let conn = Conn.mockConn('GET', '/home')
      expect(conn.method).to.eq('GET')
    })
  })

  describe('.buildConn', () => {
    it('stores the given request and response objects', () => {
      let req = Conn.mockRequest('GET', '/home')
      let res = Conn.mockResponse()
      let conn = Conn.buildConn(req, res)
      expect(conn.req).to.eq(req)
      expect(conn.res).to.eq(res)
    })

    it('stores the path of the given url in the conn', () => {
      let conn = Conn.mockConn('GET', '/home')
      expect(conn.path).to.eq('/home')
    })

    it('stores query params in the conn', () => {
      let conn = Conn.mockConn('GET', '/home?name=luiz&opt=on')
      expect(conn.query).to.eql({
        name: 'luiz',
        opt: 'on',
      })
    })
  })
})
