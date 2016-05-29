'use strict'

const EventEmitter = require('events')
const Url          = require('../locflow/url')

const genericNotFoundError = new Error("Resource not found")

class Conn extends EventEmitter {
  constructor(req, res) {
    super()
    this.url        = new Url(req.url)
    this.req        = req
    this.res        = res
    this.statusCode = 200
    this.method     = req.method
    this.path       = this.url.path
    this.query      = this.url.queryObject(true)
    this.values     = {}
    this.params     = this.query
    this.pathParams = null // This property will be set by the dispatcher once it figures it out.
  }

  /*
  ** Stringifies the given `object` and returns it. We don't need to return a
  ** promise because the "invoke" operation on the pipeline already wraps this
  ** function in a promise.
  */
  json(object) {
    return JSON.stringify(object)
  }

  /*
  ** Updates internal response status to 404 and breaks out of the promise chain
  ** with an error.
  */
  notFound(notFoundError) {
    this.status(404)
    if(notFoundError) throw notFoundError
    else              throw genericNotFoundError
  }

  /*
  ** Stores the given `statusCode` as the response status from this conn object.
  */
  status(statusCode) {
    this.statusCode = statusCode
    return this
  }

  /*
  ** Stores the given `value` assocaited with `key`. Storing values in the conn
  ** is the easier (and recommended) way to pass values from a pipeline step
  ** other steps and the final handler. The internal data structure is a
  ** object.
  */
  set(key, value) {
    this.values[key] = value
    return this
  }
  
  /*
  ** Retreives the value associated with `key`. `undefined` is returned if the
  ** key doesn't exist.
  */
  get(key) {
    return this.values[key]
  }

  /*
  ** There is a reasoning behind this method. We ideally want to abstract
  ** from the user the 'source' of every paramemeter. If its coming from the
  ** query string, url-encoded or json body or even path params. Everything 
  ** should be accessible from the `params` object.
  */
  mergeParams(params) {
    for(let key in params) {
      this.params[key] = params[key]
    }
  }

  /*
  ** Testing is a big part of application development. It should be simple to
  ** simulate a request, but it also should be reliable in the sense that if a 
  ** mocked request worked a normal request will too.
  */
  static mockRequest(method, url) {
    return { method, url }
  }

  static mockResponse() {
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

  static mockConn(method, url) {
    return new Conn(Conn.mockRequest(method, url), Conn.mockResponse())
  }

  static buildConn(req, res) {
    return new Conn(req, res)
  }
}

exports.Conn = Conn