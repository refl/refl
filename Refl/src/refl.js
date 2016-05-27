'use strict'

const File = require('./file/file').File
const Registry = require('./app/registry')
const _ = require('lodash')

/*
** Refl's public API should be defined in this object. Everything not accessable
** from this object (or it's sub objects) will be private.
*/
const Refl = {}

Refl.DEBUG = 'debug'
Refl.PRODUCTION = 'production'
Refl.executionMode = Refl.PRODUCTION

/*
** Public funciton to initialize an app.
*/
Refl.app = require('./app/initializer').initializeApp

/*
** Here is a little gotcha: although Refl works with 'multiple' applications
** there is only one mode of execution for all apps. There is no way to run
** "app x" in debug and "app y" in production.
*/
Refl.mode = function(_executionMode) {
  if(!_executionMode) return Refl.executionMode
  Refl.executionMode = _executionMode
}

/*
** This is a *very* important function. It will run before each HTTP request and
** each 
*/
Refl.prepareInteraction = function(opts) {
  if(Refl.mode() === Refl.DEBUG) {
    File.clearAppsRequireCache()
    opts.router.reset()
    for(let script in Registry.getEntryScripts()) {
      let app = Registry.getApp(script)
      try {
        let entryFunction = require(script)
        if(_.isFunction(entryFunction)) entryFunction(app)
      } catch(e) {
        // This error will be compilation related, such as invalid syntax or 
        // requiring a non-existing module. We still need to display a nice
        // HTML page.
        console.log("++++++++++++++++++++")
        console.log(e.stack)
        throw e
      }
    }
  }
}

module.exports = Refl