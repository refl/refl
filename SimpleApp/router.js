'use strict'

const Refl = require('../Refl/src/refl')
let app = Refl.app('SampleApp')

app.router.pipeline('default', [
])

app.controller('PostsController', {
  index: conn => {
    return "Index de posts controller"
  },
  show: conn => {
    return conn.params
  },
  latest: conn => {
    return "Últimos posts do software"
  }
})

app.router.scope(scope => {
  scope.pipeThrough('default')

  scope.get('/posts', 'PostsController@index')
  scope.get('/posts/:id', 'PostsController@show')
  scope.get('/posts/latest', 'PostsController@latest')

  scope.get('/home', conn => {
    var foo = "bar"
    return foo
  })

  scope.get('/', conn => {
    return "Bem vindo ao software"
  })
})
