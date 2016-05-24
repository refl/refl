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

    it('implements the `end` function', () => {
      let res = Conn.mockResponse()
      expect(res.end).to.be.a('function')
      expect(res.finished).to.be.false
      res.end('my content')
      expect(res._body).to.eq('my content')
      expect(res.finished).to.be.true
    })

    it('implements the `write` function', () => {
      let res = Conn.mockResponse()
      expect(res.write).to.be.a('function')
      // We're going to implement streaming using the `write` function.
      res.write('my')
      res.write('content')
      expect(res._body).to.eq('mycontent')
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

  describe('#empty', () => {
  })

  describe('#json', () => {
    let conn
    beforeEach(() => { conn = Conn.mockConn('GET', '/home') })

    it('returns a promise', () => {
      let promise = conn.json({})
      expect(promise.then).to.be.a('function')
      expect(promise.catch).to.be.a('function')
    })

    it('resolves the promise with the JSON string', () => {
      return conn.json({hello: "world"})
        .then(str => {
          expect(str).to.eq('{"hello":"world"}')
        })
    })

    it('rejects the promise if JSON failed to stringify', () => {
      let obj = {a: 10}
      obj.b = obj // circular reference
      return conn.json(obj)
        .catch(err => {
          expect(err).to.be.ok
        })
    })
  })
})
