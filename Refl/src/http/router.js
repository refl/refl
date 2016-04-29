'use strict'

const _ = require('lodash')
const EventEmitter = require('events')
const Scope = require('./scope').Scope
const Pipeline = require('./pipeline').Pipeline

class Router extends EventEmitter {
  constructor() {
    super()
    this.pipelines = {}
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
}

exports.Router = Router

