import EventEmitter from 'events'
import * as utils from './utils'

export const Cache = new EventEmitter()
const data = {}

/*
** Stores the given `value` associated with `key`, overriden possible existing
** value.
*/
Cache.set = function(key, value, opts) {

  // If the user specified an object in the first argument, we track each key
  // as if they're tracking each separated value.
  if(utils.isObject(key)) {
    let data = key
    Object.keys(data).forEach(key => {
      Cache.set(key, data[key], opts)
    })
    return
  }

  let previousRecord = Cache.getRecord(key)

  if(previousRecord && previousRecord.timeout) {
    clearTimeout(previousRecord.timeout)
  }

  let record = data[key] = {
    value: value,
    createdAt: new Date().getTime()
  }

  if(opts && opts.timeout) {
    record.timeout = setTimeout(() => {
      Cache.expire(key)
    }, opts.timeout)
  }

  return record
}

Cache.get = function(key) {
  let record = Cache.getRecord(key)
  if(record) return record.value
}

Cache.getRecord = function(key) {
  let record = data[key]
  if(record) return record
}

Cache.getAll = function(namespace) {
  namespace += '.'
  let keys = Object.keys(data)
  let values = {}
  keys.forEach(key => {
    if(key.indexOf(namespace) === 0) {
      let normalKey = key.replace(namespace, '')
      values[normalKey] = Cache.get(key)
    }
  })
  return values
}

Cache.has = function(key) {
  return Cache.get(key) != null
}

Cache.expire = function(key) {
  delete data[key]
}

