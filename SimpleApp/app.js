const Refl = require('../Refl/src/refl.js')

Refl.app('SampleApp').then(app => {
  app.router.pipeline('default', [])
  app.router.scope(scope => {
    scope.pipeThrough('default')
    scope.get('/home', conn => {
      return conn.json({ hello: "world" })
    })
  })
})