'use strict'

const http = require('http')
const Conn = require('./conn').Conn
const Refl = require('../refl')
const Log  = require('../log')
const _    = require('lodash')

class HTTPServer {
  constructor(router) {
    this.router = router
    this.server = http.createServer(this.handleRequest.bind(this))
    this.server.on('error', this.handleServerError.bind(this))
  }

  /*
  ** This callback is called for each request we receive.
  */
  handleRequest(req, res) {
    try {
      Refl.prepareInteraction({server: this, router: this.router})
    } catch(err) {
      // The error we're catching will be compilation related, such as invalid
      // syntax or module not found in require.
      res.statusCode = 500
      res.end(err.stack)
      return
    }

    let conn = Conn.buildConn(req, res)
    return this.router.dispatch(conn)
      .then(content => {
        if(_.isObject(content)) content = JSON.stringify(content)
        conn.res.statusCode = conn.statusCode
        conn.res.end(content)
      })
      .catch(err => {
        conn.res.statusCode = conn.statusCode
        conn.res.end(err.stack)
      })
  }

  /*
  ** Callback called whenever the node.js server encounters an error.
  */
  handleServerError(e) {
    Log.error(e)
  }

  listen(port) {
    return new Promise((resolve, reject) => {
      this.server.listen(port, (e) => {
        Log.info('HTTP server running on port [' + port + ']')
        resolve(e)
      })
    })
  }

  close() {
    return new Promise((resolve, reject) => {
      this.server.close(resolve)
    })
  }
}

class ClusterHTTPServer {
}

exports.HTTPServer = HTTPServer
exports.ClusterHTTPServer = ClusterHTTPServer
