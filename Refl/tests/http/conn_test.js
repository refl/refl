'use strict'

const expect = require('chai').expect
const Conn = require('../../src/http/conn').Conn

describe('Conn specs', () => {
  it('is a function class', () => {
    expect(Conn).to.be.a('function')
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

    it('merges query params in the params hash', () => {
      let conn = Conn.mockConn('GET', '/home?name=luiz')
      expect(conn.params).to.eql({name: 'luiz'})
    })

    // This test is in here because it calls `buildConn` internally and we're
    // testing a buildConn behaviour. Maybe change later.
    it('has a default status of 200', () => {
      let conn = Conn.mockConn('GET', '/home')
      expect(conn.statusCode).to.eq(200)
    })
  })

  describe('#empty', () => {
  })

  describe('#json', () => {
    let conn
    beforeEach(() => { conn = Conn.mockConn('GET', '/home') })

    it('returns the stringified version of the given object', () => {
      let json = conn.json({hello: "world"})
      expect(json).to.eq('{"hello":"world"}')
    })

    it('throws an error if stringify operation fails', () => {
      let obj = {a: 10}
      obj.b = obj // circular reference
      let stringify = () => { conn.json(obj) }
      expect(stringify).to.throw()
    })
  })

  describe('#notFound', () => {
    it('assigns 404 to the conn status', () => {
      let conn = Conn.mockConn('GET', '/home')
      try {
        conn.notFound() // ignoring the thrown error for now
      } catch(e) {}
      expect(conn.statusCode).to.eq(404)
    })

    it('throws resource not found error', () => {
      let conn = Conn.mockConn('GET', '/home')
      let handler = () => { conn.notFound() }
      expect(handler).to.throw(/not found/)
    })
  })

  describe('#status', () => {
    it('stores the given status internally', () => {
      let conn = Conn.mockConn('GET', '/home')
      conn.status(280)
      expect(conn.statusCode).to.eq(280)
    })

    it('returns the conn itself', () => {
      let conn = Conn.mockConn('GET', '/home')
      expect(conn.status(280)).to.eq(conn)
    })
  })

  describe('#set and #get', () => {
    let conn
    beforeEach(() => { conn = Conn.mockConn('GET', '/home') })

    it('stores the given value with set', () => {
      expect(conn.set('name', 'Luiz')).to.be.ok // strings
      expect(conn.set('age', 10)).to.be.ok      // numbers
      expect(conn.set('my-key', {})).to.be.ok   // objects
    })

    it('returns a reference to the conn when storing values (chain)', () => {
      expect(conn.set('name', 'Luiz')).to.eq(conn)
      conn.set('name', 'Luiz').set('age', 10).set('my-key', {}) // chainning
    })

    it('retreives existing values with get', () => {
      expect(conn.get('name')).to.be.undefined
      conn.set('name', 'Luiz')
      expect(conn.get('name')).to.eq('Luiz')
    })

    it('updates existing values with set', () => {
      conn.set('name', 'Paulo')
      expect(conn.get('name')).to.eq('Paulo')
      conn.set('name', 'Luiz')
      expect(conn.get('name')).to.eq('Luiz')
    })
  })

  describe('#mergeParams', () => {
    it('starts with an empty params object', () => {
      let conn = Conn.mockConn('GET', '/home')
      expect(conn.params).to.eql({})
    })

    it('inserts the given object in the params hash', () => {
      let conn = Conn.mockConn('GET', '/home')
      let paramsRef = conn.params
      conn.mergeParams({hello: "world"})
      expect(conn.params).to.eql({hello: "world"})
      expect(paramsRef).to.eql({hello: "world"}) // make sure we're actually modifying the object
    })

    it('overrides existing params', () => {
      let conn = Conn.mockConn('GET', '/home')
      conn.mergeParams({color: "red"})
      conn.mergeParams({color: "blue"})
      expect(conn.params).to.eql({color: "blue"})
    })
  })

  describe('events', () => {
    it('registers a callback with the `on` function')
    it('calls the `beforeSend` callback before the conn sends')
    it('calls the `afterSend` callback after the conn sends')
  })
})
