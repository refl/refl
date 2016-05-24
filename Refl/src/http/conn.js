'use strict'

const Conn = exports.Conn = {}
const Url = require('../locflow/url')

/*
** Testing is a big part of application development. It should be simple to
** simulate a request, but it also should be reliable in the sense that if a 
** mocked request worked a normal request will too.
*/
Conn.mockRequest = (method, url) => {
  return { method, url, }
}

Conn.mockResponse = () => {
  return {
    end: function(str) { 
      str ? this._body = str : this._body
      this.finished = true
    },
    write: function(str) {
      this._body ? this._body += str : this._body = str
    },
    finished: false,
  }
}

Conn.mockConn = (method, url) => {
  return Conn.buildConn(Conn.mockRequest(method, url), Conn.mockResponse())
}

/*
** Returns as promise that resolves with the given object stringified and
** rejects if the operation failed.
*/
Conn.json = function(object) {
  return new Promise((resolve, reject) => {
    let string = JSON.stringify(object)
    resolve(string)
  })
}

Conn.buildConn = (req, res) => {
  let url = new Url(req.url)
  return { 
    req, 
    res,
    method: req.method,
    path: url.path,
    query: url.queryObject(),
    json: Conn.json
  }
}
