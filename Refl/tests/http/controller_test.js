const expect = require('chai').expect
const Controller = require('../../src/http/controller')

describe('Controller specs', () => {
  it('is a function object', () => {
    expect(Controller).to.be.a('function')
    let controller = new Controller
    expect(controller).to.be.ok
  })

  describe('routes', () => {
    it('assigns each function in the routes object to the controller', () => {
      let ctrl = new Controller({}, 'MyController', {
        home:  function() {},
        about: function() {},
        cats:  function() {}
      })
      expect(ctrl.home).to.be.a('function')
      expect(ctrl.about).to.be.a('function')
      expect(ctrl.cats).to.be.a('function')
    })

    it('throws an error if we provide a reserved route name', () => {
      let createController = () => {
        new Controller({}, 'MyController', {
          _app: function() {}
        })
      }
      expect(createController).to.throw(/reserved route name/)
    })
  })
})