'use strict'

const EventEmitter = require('events')
const _            = require('lodash')

/*
** Invalid routes the user may define in their controllers
*/
// TODO: Put EventEmtiter attributes here.
const invalidRouteNames = [
  '_name',
  '_app',
]

/*
**
*/
class Controller extends EventEmitter {
  constructor(app, name, routes) {
    super()
    this._name = name
    this._app  = app
    _.keys(routes).forEach(key => {
      if(_.includes(invalidRouteNames, key))
        throw new Error("reserved route name [" + key + "]")
      // We're assigning user defined routes to this controller because of
      // reasons.
      this[key] = routes[key]
    })
  }
}

module.exports = Controller