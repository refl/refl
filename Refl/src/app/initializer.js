'use strict'

const _ = require('lodash')

/*
** Stores apps initialized through the `initializeApp` function. Refl denies
** the same name for multiple apps - thus an object.
*/
let apps = {}

/*
** Refl's initialization process involves the following steps:
** - Starting a TCP server for in-cluster communication between nodes.
** - Connecting to known nodes in the cluster.
** - Connecting to discovered nodes in the cluster.
** - Loading models
** - Loading controllers 
** - Starting a HTTP server
*/
exports.initializeApp = function initializeApp(appName, config) {
  if(apps[appName]) {
    throw new Error("app with name [" + appName + "] already exists")
  }
  const App = require('./app').App
  let app = new App(appName)
  apps[appName] = app
  return app.initialize()
}

exports.getApp = function getApp(appName) {
  return apps[appName]
}

/*
** Removes all apps defined using the `initializeApp` function
*/
exports.clearAllApps = function clearAllApps() {
  let appNames = _.keys(apps)
  let lastPromise = _.reduce(appNames, (promise, appName) => {
    return promise.then(() => {
      let app = apps[appName]
      delete apps[appName] // remove from our apps map
      return app.close()
    })
  }, Promise.resolve())
  return lastPromise
}
