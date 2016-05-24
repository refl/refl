'use strict'

const http = require('http')
const Conn = require('./conn').Conn
const Log  = require('../log')
const _    = require('lodash')

class HTTPServer {
  constructor(router) {
    this.router = router
    this.server = http.createServer(this.handleRequest.bind(this))
    this.server.on('error', this.handleServerError.bind(this))
  }

  handleRequest(req, res) {
    let conn = Conn.buildConn(req, res)
    return this.router.dispatch(conn)
      .then(content => {
        if(_.isObject(content)) {
          content = JSON.stringify(content)
        }
        conn.res.end(content)
      })
      .catch(err => {
        conn.res.end(err)
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
}

class ClusterHTTPServer {
}

exports.HTTPServer = HTTPServer
exports.ClusterHTTPServer = ClusterHTTPServer
