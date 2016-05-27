'use strict'

module.exports = app => {
  
  app.router.pipeline('default', [
  ])

  app.router.scope(scope => {
    scope.pipeThrough('default')

    scope.get('/home', conn => {
      var foo : "bar"
      return foo
    })

    scope.get('/', conn => {
      return "Bem vindo ao software"
    })
  })
}