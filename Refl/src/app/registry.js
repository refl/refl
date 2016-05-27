'use strict'

const _ = require('lodash')

/*
** Entry scripts are the "root" scripts we need to load. Those scripts will
** load more dependencies.
*/
let entryScripts = {}

exports.addEntryScript = function addEntryScript(script, app) {
  entryScripts[script] = app
}

exports.getEntryScripts = function getEntryScripts() {
  return entryScripts
}

exports.countEntries = function countEntries() {
  return _.keys(entryScripts).length
}

exports.getApp = function getApp(script) {
  return entryScripts[script]
}