'use strict'

const EventEmitter = require('events')
const _            = require('lodash')
const Conn         = require('./conn').Conn

/*
** Generates the matching regular expression for the given path. This regexp
** is matched against incoming HTTP request's path.
*/
function generateRouteRegex(path) {
  let params = path.match(/:[^\/]+/g)
  if(params == null) {
    return new RegExp('^' + path + '$')
  } else {
    params.forEach(param => {
      path = path.replace(param, '([^\/]+)')
    })
    return new RegExp('^' + path + '$')
  }
}

function findNamedParams(path) {
  let params = path.match(/:[^\/]+/g)
  if(params == null) {
    return []
  } else {
    return params.map(param => {
      return param.indexOf(':') === 0 ? param.replace(':', '') : param
    })
  }
}

/*
** The Dispatcher is responsible for registering http routes and matching against
** incoming requests. It is *not* responsible for handling the request or
** calling a middleware. The routing facilities (resource, middleware, etc.) 
** will be built on top of of this class.
*/
class Dispatcher extends EventEmitter {
  constructor() {
    super()
    this.routes = []
  }

  /*
  ** Registers the given handler associated with (method, path).
  */
  match(method, path, handler) {
    if(!path.startsWith('/')) path = '/' + path
    let matcher = generateRouteRegex(path)
    let namedParams = findNamedParams(path)

    // This check prevents the user specifing multiple params with the same
    // name. For example: '/users/:id/comments/:id'.
    if(_.uniq(namedParams).length < namedParams.length) {
      throw new Error('multiple params with the same name: ' + path)
    }

    return this.routes.push({
      method: method,
      handler: handler,
      originalPath: path,
      matcher: matcher,
      namedParams: namedParams
    })
  }

  dispatch(conn) {
    let lastMatch, method = conn.method, path = conn.path
    let route = this.routes.find(route => {
      lastMatch = path.match(route.matcher)
      return route.method === method && lastMatch
    })
    if(route && lastMatch) {
      let params = {}
      if(lastMatch.length > 1) {
        route.namedParams.forEach((param, index) => {
          params[param] = lastMatch[index + 1]
        })
      }
      conn.pathParams = params
      return route.handler(conn)
    } else {
      return Promise.resolve(Conn.build404(conn))
    }
  }
}

Dispatcher.methodGET    = 'GET'
Dispatcher.methodPOST   = 'POST'
Dispatcher.methodPUT    = 'PUT'
Dispatcher.methodDELETE = 'DELETE'
Dispatcher.methodPATCH  = 'PATCH'
Dispatcher.methodHEAD   = 'HEAD'

exports.Dispatcher = Dispatcher
