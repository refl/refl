'use strict'
const EventEmitter = require('events')
const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const File = exports.File = new EventEmitter()

const defaultEncoding = 'utf-8'

/*
** Reads the content of given file and returns it's content as a string. An
** error is thrown if the file does not exist and defaultValue is not provided.
*/
File.read = (filepath, encoding) => {
  encoding = encoding || defaultEncoding
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, encoding, (err, contents) => {
      if(err) return reject(err)
      resolve(contents)
    })
  })
}

/*
** Loads (and possibly reloads) the given module ignoring current cache.
*/
File.requireUncached = (module) => {
  delete require.cache[require.resolve(module)]
  return require(module)
}

/*
** Removes scripts from the `require` cache.
*/
File.clearAppsRequireCache = function() {
  for(let moduleName in require.cache) {
    delete require.cache[moduleName]
  }
}

/*
** Walks recursively through the given directory requiring all files ignoring
** existing cache. This function should be used in debug mode, where files are 
** changing all the time.
*/
File.requireAll = (dir) => {
  return File.walk(dir).then(files => {
    return files.map(file => {
      return require(file)
    })
  })
}

/*
** Walks recursively through the given directory requiring all files keeping
** the current cached version. This function should be used in production,
** where files are not expected to change from request to request.
*/
File.requireAll = (dir) => {
  return File.walk(dir).then(files => {
    return files.map(file => {
      return require(file)
    })
  })
}

File.ls = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if(err) return reject(err)
      resolve(files)
    })
  })
}

/*
** Promised wrapper for node's `fs.stat`.
*/
File.stat = (path) => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stat) => {
      if(err) return reject(err)
      stat.file = path // little convinience property :-)
      resolve(stat)
    })
  })
}

/*
** Similar to `File.ls`, but searches files in subdirectoties recursively.
*/
File.walk = (dir) => {
  return new Promise((resolve, reject) => {
    let iterate = (dir, next) => {
      File.ls(dir).then(files => {
        return Promise.all(files.map(file => {
          return File.stat(path.resolve(dir, file))
        }))
      }).then(stats => {
        let files = []
        let pending = stats.length
        stats.forEach(stat => {
          if(stat.isDirectory()) {
            iterate(stat.file, nestedFiles => {
              pending -= 1
              nestedFiles.forEach(file => { files.push(file) })
              if(pending === 0) next(files)
            })
          } else {
            pending -= 1
            files.push(stat.file)
          }
        })
        if(pending === 0) next(files)
      }).catch(reject)
    }
    iterate(dir, resolve)
  })
}

File.write = (path, content) => {
}
