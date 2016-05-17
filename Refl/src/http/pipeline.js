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

  /*
  ** Calls the 
  */
  invoke(conn, callback) {
    if(this.steps.length <= 0) return callback(conn)
    let currentStep = 0
    let invokeNext = (conn) => {
      let currentCallback = this.steps[currentStep] || callback
      currentStep += 1
      if(currentCallback) {
        return currentCallback(conn, invokeNext)
      }
    }
    return invokeNext(conn)
  }

  // Generates a function that calls each step in the given pipelines and lastly
  // the given handler.
  static wrap(pipelines, handler) {
    return function(conn) {
      pipelines.forEach(pipeline => {
        pipeline.invoke(conn, res => { conn = res })
      })
      return handler(conn)
    }
  }
}

exports.Pipeline = Pipeline
