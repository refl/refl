const expect = require('chai').expect
const App = require('../../src/app/app').App

describe('App specs', () => {
  it('is a function object', () => {
    expect(App).to.be.a('function')
    let app = new App()
    expect(app).to.be.an('object')
  })
})