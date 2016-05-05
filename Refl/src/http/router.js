'use strict'

const _ = require('lodash')
const EventEmitter = require('events')
const Scope = require('./scope').Scope
const Pipeline = require('./pipeline').Pipeline
const Dispatcher = require('./dispatcher').Dispatcher

class Router extends EventEmitter {
  constructor() {
    super()
    this.pipelines = {}
    this.dispatcher = new Dispatcher()
  }

  hasPipeline(name) {
    return !!this.pipelines[name]
  }

  /*
  ** Creates a new middleware with the given name and steps
  */
  pipeline(name, steps) {
    if(!steps) {
      return this.pipelines[name]
    }
    let pipeline = new Pipeline(name, steps)
    if(this.hasPipeline(name)) {
      throw new Error("pipeline already registered: " + name)
    }
    if(!pipeline.isValid()) {
      throw new Error("invalid pipeline callbacks", steps)
    }
    this.pipelines[name] = pipeline
  }

  /*
  ** Creates a new scope for this router, calling the given callback with it.
  */
  scope(callback) {
    let scope = new Scope(this)
    // TODO: study if we should store the scope reference in the router as well.
    callback(scope)
  }

  dispatch(conn) {
  }
}

exports.Router = Router

