'use strict'

const _ = require('lodash')

class Pipeline {
  constructor(name, steps) {
    this.name  = name
    this.steps = steps
  }

  /*
  ** Returns true if this pipeline either has no steps or all steps are 
  ** functions, false otherwise.
  */
  isValid() {
    return _.every(this.steps, _.isFunction)
  }

  invoke(conn) {
    return this.steps.reduce((promise, callback) => {
      return promise.then(conn => {
        return callback(conn)
      })
    }, Promise.resolve(conn))
  }

  // Generates a function that calls each step in the given pipelines and lastly
  // the given handler.
  static wrap(pipelines, handler) {
    return function(conn) {
      let promise = pipelines.reduce((promise, pipeline) => {
        return promise.then(conn => {
          return pipeline.invoke(conn)
        })
      }, Promise.resolve(conn))
      return promise.then(conn => {
        return handler(conn)
      })
    }
  }
}

exports.Pipeline = Pipeline
