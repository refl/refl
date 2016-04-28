'use strict'

class Scope {
  constructor() {
    this._prefix = ''
    this._pipelines = []
  }

  prefix(str) {
    if(this._prefix !== '') {
      throw new Error("scope prefix already specified: " + this._prefix)
    }
    this._prefix = str
  }

  getPrefix() {
    return this._prefix
  }

  hasPrefix() {
    return this.getPrefix() !== ''
  }
}

exports.Scope = Scope
