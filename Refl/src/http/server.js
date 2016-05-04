'use strict'

const http = require('http')
const Conn = require('./conn')

class HTTPServer {
  constructor(router) {
    this.router = router
    this.server = http.createServer(this.handleRequest)
  }

  handleRequest(req, res) {
    conn = Conn.buildConn(req, res)
    this.router.dispatch(conn)
  }

  listen(port) {
    this.server.listen(port, () => {
      console.log("Server running on port: " + port)
    })
  }
}

class ClusteredHTTPServer {
}

exports.HTTPServer = HTTPServer
exports.ClusteredHTTPServer = ClusteredHTTPServer
