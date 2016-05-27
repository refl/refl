'use strict'

const Router            = require('../http/router').Router
const Registry          = require('./registry')
const HTTPServer        = require('../http/server').HTTPServer
const ClusterHTTPServer = require('../http/server').ClusterHTTPServer
const _                 = require('lodash')

class App {
  constructor(name) {
    this.name = name
    this.router = new Router()
  }

  /*
  ** Requires the given file using the `require` function, which might be
  ** hijacked in order to make development easier.
  */
  load(resolvedModule) {
    this.entryScript = resolvedModule
    Registry.addEntryScript(this.entryScript, this)
    let entryFunction = require(this.entryScript)
    if(_.isFunction(entryFunction)) {
      entryFunction(this)
    } else {
      throw new Error("entry script be exported as a function")
    }
  }

  /*
  ** Returns a promise that resolves with the app after every service is 
  ** initialized.
  */
  initialize() {
    this.server = new HTTPServer(this.router)
    return this.server.listen(8080)
      .then(status => {
        return this
      })
  }

  /*
  ** Closes all services (HTTP server, database connection, etc.). This function
  ** returns a promise that resolves when all services are stopped.
  */
  close() {
    return this.server.close()
  }
}

exports.App = App