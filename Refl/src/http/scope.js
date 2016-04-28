'use strict'

class Scope {
  constructor() {
    this._prefix = ''
    this._inheritedPrefix = ''
    this._pipelines = []
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
    let nestedScope = new Scope()
    nestedScope._inheritedPrefix = this.prefix()
    callback(nestedScope)
  }
  group(callback) { return this.nest(callback) }
}

exports.Scope = Scope
