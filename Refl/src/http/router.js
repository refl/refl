'use strict'

const _            = require('lodash')
const EventEmitter = require('events')
const Scope        = require('./scope').Scope
const Pipeline     = require('./pipeline').Pipeline
const Dispatcher   = require('./dispatcher').Dispatcher

class Router extends EventEmitter {
  constructor(app) {
    super()
    this.app        = app
    this.pipelines  = {}
    this.dispatcher = new Dispatcher()
    this.dispatch   = this.dispatcher.dispatch.bind(this.dispatcher)
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

  reset() {
    this.dispatcher.reset()
    for(let pipelineName in this.pipelines) {
      delete this.pipelines[pipelineName]
    }
  }

  /*
  ** Creates a new scope for this router, calling the given callback with it.
  */
  scope(callback) {
    let scope = new Scope(this)
    // TODO: should we keep a scope reference in the router?
    callback(scope)
  }
}

exports.Router = Router

