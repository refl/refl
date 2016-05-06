'use strict'

const Conn = exports.Conn = {}
const Url = require('../locflow/url')

/*
** Testing is a big part of application development. It should be simple to
** simulate a request, but it also should be reliable in the sense that if a 
** mocked request worked, a normal request will too.
*/
Conn.mockRequest = (method, url) => {
  return { method, url, }
}

Conn.mockResponse = () => {
  return {
    send: (str) => { this.response = str }
  }
}

Conn.mockConn = (method, url) => {
  return Conn.buildConn(Conn.mockRequest(method, url), Conn.mockResponse())
}

Conn.buildConn = (req, res) => {
  let url = new Url(req.url)
  return { 
    req, 
    res,
    method: req.method,
    path: url.path,
    query: url.queryObject(),
  }
}
