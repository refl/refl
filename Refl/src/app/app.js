'use strict'

const Router            = require('../http/router').Router
const Registry          = require('./registry')
const HTTPServer        = require('../http/server').HTTPServer
const ClusterHTTPServer = require('../http/server').ClusterHTTPServer
const Controller        = require('../http/controller')
const _                 = require('lodash')

class App {
  constructor(name) {
    this.name = name
    this.router = new Router(this)
    this.controllers = {}
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
  ** Creates or returns a controller with the given name
  */
  controller(name, opts) {
    if(opts) {
      // We're registering a controller
      return this.controllers[name] = new Controller(this, name, opts)
    } else {
      // We looking for a controller
      return this.controllers[name]
    }
  }

  /*
  ** Searches for the given `key` in the app controllers. The key should be
  ** specified in the following format:
  **
  ** "PostsController@index"
  **
  ** Where, `PostsController` (before the at sign) is the controller name and
  ** and `index` (after the at sign) is the function name. The at sign could
  ** also be a hash.
  */
  action(key) {
    let parts = key.split(/[@#]/)
    if(parts.length != 2) throw new Error("invalid action key [" + key + "]")
    let controllerName = parts[0], methodName = parts[1]
    let controller = this.controller(controllerName)
    if(!controller) {
      throw new Error("controller [" + controllerName + "] not found")
    }
    let method = controller[methodName]
    if(!method) {
      throw new Error("action [" + methodName + "] not found in controller [" + controllerName + "]")
    }
    return method
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