'use strict'

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
    callback(nestedScope)
  }
  group(callback) { return this.nest(callback) }


  /*
  ** Specifies that all routes in this scope must pass through the given
  ** pipeline.
  */
  pipeThrough(pipelineName) {
    if(!this._router) {
      throw new Error("scope doesn't belong to a router")
    }
    let pipeline = this._router.pipeline(pipelineName)
    if(!pipeline) {
      throw new Error("pipeline ["+pipelineName+"] not found in router")
    }
    return this._pipelines.push(pipeline)
  }

  /*
  ** Returns an array with the names of all pipelines this scope passes through
  */
  pipesThrough() {
    return this._pipelines.map(pipeline => { return pipeline.name })
  }
}

exports.Scope = Scope
