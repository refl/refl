'use strict'

const _ = require('lodash')

class Scope {
  constructor(router) {
    this._prefix = ''
    this._inheritedPrefix = ''
    this._pipelines = []
    this._router = router
  }

  /*
  ** Getter and setter for the scope's prefix. If called with an argument the
  ** prefix is assigned. If called without an argument the current prefix
  ** is returned. For example:
  ** ```
  ** let scope = new Scope();
  ** scope.prefix("/foo");
  ** console.log(scope.prefix()); // # => "/foo"
  ** ```
  */
  prefix(str) {
    if(!str) return this._inheritedPrefix + this._prefix
    if(this._prefix !== '') {
      throw new Error("scope prefix already specified: " + this._prefix)
    }
    this._prefix = str
  }

  hasPrefix() {
    return this.prefix() !== ''
  }

  nest(callback) {
    let nestedScope = new Scope(this._router)
    nestedScope._inheritedPrefix = this.prefix()
    this.pipesThrough().forEach(pipeline => {
      nestedScope.pipeThrough(pipeline)
    })
    callback(nestedScope)
  }
  group(callback) { return this.nest(callback) }


  /*
  ** Specifies that all routes in this scope must pass through the given
  ** pipeline.
  */
  pipeThrough(pipeline) {
    if(!this._router) {
      throw new Error("scope doesn't belong to a router")
    }
    if(_.isArray(pipeline) && pipeline.length > 0) {
      // We should create an anonymous pipeline, and then register it in this
      // scope.
      let pipelineName = _.uniqueId('pipeline_')
      this._router.pipeline(pipelineName, pipeline)
      this.pipeThrough(pipelineName)
    } else {
      let pipelineRef = this._router.pipeline(pipeline)
      if(!pipelineRef) {
        throw new Error("pipeline ["+pipeline+"] not found in router")
      }
      return this._pipelines.push(pipelineRef)
    }
  }

  /*
  ** Returns an array with the names of all pipelines this scope passes through
  */
  pipesThrough() {
    return this._pipelines.map(pipeline => { return pipeline.name })
  }

  match(method, path, handler) {
    if(!this._router) {
      throw new Error("No router associated with scope")
    }
    return this._router.dispatcher.match(method, this.prefix() + path, handler)
  }

  get(path, handler) {
    return this.match('GET', path, handler)
  }

  post(path, handler) {
    return this.match('POST', path, handler)
  }

  put(path, handler) {
    return this.match('PUT', path, handler)
  }

  patch(path, handler) {
    return this.match('PATCH', path, handler)
  }

  delete(path, handler) {
    return this.match('DELETE', path, handler)
  }
}

exports.Scope = Scope
