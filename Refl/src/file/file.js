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

  // The following code identifies the current script path to find the Refl
  // project path. When we delete things from cache, we should keep all
  // Refl modules so we don't lose any internal data and configuration.
  let currentScript = __filename
  let reflPrefix = currentScript.substr(0, currentScript.indexOf('/src/file/file.js'))

  for(let moduleName in require.cache) {

    // if it's a module inside Refl, we keep it on the cache.
    if(moduleName.startsWith(reflPrefix)) continue

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

/*
** Scans the given directory listing all files in it. `ls` returns a promise
** that resolves to an array of relative file paths. If you want an array of
** absolute file paths see the function `lsResolve`.
*/
File.ls = (path) => {
  return new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if(err) return reject(err)
      resolve(files)
    })
  })
}

/*
** Similar to `ls`, but the array of files returned are absolute paths.
*/
File.lsResolve = (dir) => {
  return File.ls(dir)
    .then(files => {
      return files.map(file => {
        // TODO: maybe require.resolve isn't the best function here?
        return require.resolve(path.join(dir, file))
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
