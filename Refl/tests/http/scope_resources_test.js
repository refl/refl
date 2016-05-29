'use strict'

const expect = require('chai').expect
const sinon  = require('sinon')
const Conn   = require('../../src/http/conn').Conn
const App    = require('../../src/app/app').App
const _      = require('lodash')

describe('Scope resources REST specs', () => {
  let app, scope, postsController
  beforeEach(() => {
    app = new App('MyApp')
    app.router.scope(_scope => { scope = _scope })
    postsController = app.controller('PostsController', {
      index:   sinon.spy(conn => {}),
      create:  sinon.spy(conn => {}),
      store:   sinon.spy(conn => {}),
      edit:    sinon.spy(conn => {}),
      update:  sinon.spy(conn => {}),
      destroy: sinon.spy(conn => {}),
    })
  })

  it('creates a GET path to index', () => {
    scope.resources('posts', app.controller('PostsController'))
    return app.router.dispatch(Conn.mockConn('GET', '/posts'))
      .then(arg => {
        expect(postsController.index.called).to.be.true
      })
  })

  it('creates a GET path/create to create', () => {
    scope.resources('posts', app.controller('PostsController'))
    return app.router.dispatch(Conn.mockConn('GET', '/posts/create'))
      .then(arg => {
        expect(postsController.create.called).to.be.true
      })
  })

  it('creates a POST path to create', () => {
    scope.resources('posts', app.controller('PostsController'))
    return app.router.dispatch(Conn.mockConn('POST', '/posts'))
      .then(arg => {
        expect(postsController.store.called).to.be.true
      })
  })

  it('creates a GET path/:id to show', () => {
  })
  
  it('creates a GET path/:id/edit to edit')
  it('creates a PATCH/PUT path to path/:id to update')
  it('crates a DELETE path to path/:id to destroy')
  it('accepts a third parameter with `only` filter')
  it('accepts a third parameter with `except` filter')
  it('ignores if a method is not defined in the controller')

  it('clears last slash if user specifies /path/')
})

describe('Nested rest resource', () => {
  it('creates a GET parent/:parent_id/path to index')
  it('creates a GET parent/:parent_id/path/new to new')
  it('creates a POST parent/:parent_id/path to create')
  it('creates a GET parent/:parent_id/path/:id to show')
  it('creates a GET parent/:parent_id/path/:id/edit to edit')
  it('creates a PATCH/PUT path to parent/:parent_id/path/:id to update')
  it('crates a DELETE path to parent/:parent_id/path/:id to destroy')
})
