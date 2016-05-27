const Refl = require('../Refl/src/refl')

Refl.mode(Refl.DEBUG)
Refl.app('SampleApp').then(app => {
  app.load(require.resolve('./router'))
}).catch(err => {
  console.log(err.stack)
})