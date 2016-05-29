const expect = require('chai').expect
const App = require('../../src/app/app').App
const Registry = require('../../src/app/registry')
const Conn = require('../../src/http/conn').Conn

describe('App specs', () => {
  it('is a function object', () => {
    expect(App).to.be.a('function')
    let app = new App()
    expect(app).to.be.an('object')
  })

  it('has a router with a reference to the app', () => {
    let app = new App('MyApp')
    expect(app.router).to.be.ok
    expect(app.router.app).to.eq(app)
  })

  describe('#load', () => {
    let app
    beforeEach(() => {
      app = new App("MyApp")
    })

    it('stores a reference to the entry script in the refl object', () => {
      expect(Registry.countEntries()).to.eq(0)
      app.load(require.resolve('../resources/app1.js'))
      expect(Registry.countEntries()).to.eq(1)
      expect(Registry.getApp(require.resolve('../resources/app1.js'))).to.eq(app)
    })
  })

  describe('#controller', () => {
    let app
    beforeEach(() => { app = new App("MyApp") })

    it('creates a new controller with the given name', () => {
      let ctrl = app.controller('MyController', {})
      expect(ctrl).to.be.ok
      // we use _name instead of name to avoid conflicts with user defined routes
      expect(ctrl._name).to.eq('MyController') 
      expect(ctrl._app).to.eq(app)
    })

    it('returns existing controller if no config is specified', () => {
      expect(app.controller('MyController')).to.be.undefined
      let ctrl = app.controller('MyController', {})
      expect(app.controller('MyController')).to.eq(ctrl)
    })

    it('registers a route with a controller method', () => {
      app.controller('CatsController', {
        home: conn => { return conn.set("hello", "world") }
      })
      app.router.scope(scope => {
        scope.get('/home', app.controller('CatsController').home)
      })
      return app.router.dispatch(Conn.mockConn('GET', '/home'))
        .then(conn => {
          expect(conn.get('hello')).to.eq('world')
        })
    })
  })

  describe('#action', () => {
    let app
    beforeEach(() => { app = new App('MyApp') })

    it('returns a function defined in a controller', () => {
      let showFunction = function() {}
      app.controller('PostsController', {
        show: showFunction
      })
      expect(app.action('PostsController@show')).to.eq(showFunction)
    })
      
    it('works with the at or hash sign', () => {
      let showFunction = function() {}
      app.controller('PostsController', {
        show: showFunction
      })
      //                                | could be '#' or '@'
      //                                v
      expect(app.action('PostsController#show')).to.eq(showFunction)
    })

    it('throws an error if the key is in an invalid format', () => {
      let searchAction = () => { app.action('foo@bar@qux') }
      expect(searchAction).to.throw(/invalid action key/)
    })

    it('throws an error if the function was not found', () => {
      app.controller('PostsController', {
      })
      let searchAction = () => { app.action('PostsController@search') }
      expect(searchAction).to.throw(/action \[search\] not found in controller \[PostsController\]/)
    })

    it('throws an error if controller was not found', () => {
      let searchAction = () => { app.action('PostsController@search') }
      expect(searchAction).to.throw(/controller \[PostsController\] not found/)
    })
  })
})