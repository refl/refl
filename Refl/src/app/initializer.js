const Router            = require('../http/router').Router
const HTTPServer        = require('../http/server').HTTPServer
const ClusterHTTPServer = require('../http/server').ClusterHTTPServer
const _                 = require('lodash')

/*
** Stores apps initialized through the `initializeApp` function. Refl denies
** the same name for multiple apps - thus an object.
*/
let apps = {}

class App {
  constructor(name) {
    this.name = name
    this.router = new Router()
  }

  /*
  ** Returns a promise that resolves with the app after every service is 
  ** initialized.
  */
  initialize() {
    this.server = new HTTPServer(this.router)
    return this.server.listen(8080)
      .then(status => {
        return this
      })
  }

  /*
  ** Closes all services (HTTP server, database connection, etc.). This function
  ** returns a promise that resolves when all services are stopped.
  */
  close() {
    return new Promise((resolve, reject) => {
      this.server.close(() => {
        resolve()
      })
    })
  }
}

/*
** Refl's initialization process involves the following steps:
** - Starting a TCP server for in-cluster communication between nodes.
** - Connecting to known nodes in the cluster.
** - Connecting to discovered nodes in the cluster.
** - Loading models
** - Loading controllers 
** - Starting a HTTP server
*/
exports.initializeApp = function initializeApp(appName) {
  if(apps[appName]) {
    throw new Error("app with name [" + appName + "] already exists")
  }
  let app = new App(appName)
  apps[appName] = app
  return app.initialize()
}

/*
** Removes all apps defined using the `initializeApp` function
*/
exports.clearAllApps = function clearAllApps() {
  let appNames = _.keys(apps)
  // return _.reduce(appNames, (promise, appName) => {
  //   return promise.then(() => {

  //   })
  // }, Promise.resolve())
}
