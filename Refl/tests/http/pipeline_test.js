'use strict'

const Pipeline = require('../../src/http/pipeline').Pipeline
const expect = require('chai').expect
const sinon = require('sinon')

describe('Pipeline specs', () => {
  it('is a function class', () => {
    expect(Pipeline).to.be.a('function')
    let pipeline = new Pipeline()
    expect(pipeline).to.be.ok
  })

  it('creates a pipeline with a name', () => {
    let pipeline = new Pipeline("sample", [])
    expect(pipeline.name).to.eq("sample")
  })

  describe('#isValid', () => {
    it('returns true if all steps are functions (or empty)', () => {
      let pipeline = new Pipeline("sample", [function(){}])
      expect(pipeline.isValid()).to.be.true
      pipeline = new Pipeline("sample", [])
      expect(pipeline.isValid()).to.be.true
    })

    it('returns false if one step isnt a function', () => {
      let pipeline = new Pipeline("sample", [10])
      expect(pipeline.isValid()).to.be.false
    })
  })

  describe('#invoke', () => {
    it('calls all functions in the pipeline', () => {
      let step1 = sinon.spy((conn, next) => { next(conn) })
      let step2 = sinon.spy((conn, next) => { next(conn) })
      let pipeline = new Pipeline("sample", [step1, step2])
      pipeline.invoke()
      expect(step1.called).to.be.true
      expect(step2.called).to.be.true
    })

    it('calls the pipeline step with the `invoke` argument', () => {
      let step1 = (conn, next) => {
        expect(conn).to.eql("my connection")
      }
      let pipeline = new Pipeline("sample", [step1])
      pipeline.invoke("my connection")
    })

    it('calls the next step with the result from the previous', () => {
      let step1 = sinon.spy((conn, next) => { next(conn + "bar") })
      let step2 = sinon.spy((conn, next) => { expect(conn).to.eq("foobar") })
      let pipeline = new Pipeline("sample", [step1, step2])
      pipeline.invoke("foo")
      expect(step1.called).to.be.true
      expect(step2.called).to.be.true
    })

    it('calls the given callback with the result from the last step', (done) => {
      let step1 = (conn, next) => { next(conn + "bar") }
      let pipeline = new Pipeline("sample", [step1])
      pipeline.invoke("foo", conn => {
        expect(conn).to.eq("foobar")
        done()
      })
    })

    it('calls the callback directly if the pipeline has no steps', (done) => {
      let pipeline = new Pipeline("sample", [])
      pipeline.invoke("foo", conn => {
        expect(conn).to.eq("foo")
        done()
      })
    })
  })

  describe('#wrap', () => {
    it('returns a wrapped function', () => {
      let pipeline = new Pipeline("sample", [])
      let wrapped = Pipeline.wrap([pipeline], function() {})
      expect(wrapped).to.be.a('function')
    })
    
    it('calls the handler if an empty pipeline is provided', () => {
      let handler = sinon.spy()
      let wrapped = Pipeline.wrap([], handler)
      wrapped()
      expect(handler.called).to.be.true
    })
    
    it('calls the pipeline before the handler', () => {
      let step1 = sinon.spy((num, next) => { next(num + 2) })
      let step2 = sinon.spy((num, next) => { next(num * 3) })
      let handler = sinon.spy(num => {
        expect(num).to.eq(9)
      })
      let pipeline = new Pipeline("sample", [step1, step2])
      let wrapped = Pipeline.wrap([pipeline], handler)
      wrapped(1)
      expect(step1.called).to.be.true
      expect(step2.called).to.be.true
      expect(handler.called).to.be.true
    })

    it('calls the pipeline in the same order in the array', () => {
      let step1 = sinon.spy((num, next) => { next(num + 2) })
      let step2 = sinon.spy((num, next) => { next(num * 3) })
      let handler = sinon.spy(num => {
        expect(num).to.eq(9)
      })
      let pipeline1 = new Pipeline("sample", [step1])
      let pipeline2 = new Pipeline("other", [step2])
      let wrapped = Pipeline.wrap([pipeline1, pipeline2], handler)
      wrapped(1)
      expect(step1.called).to.be.true
      expect(step2.called).to.be.true
      expect(handler.called).to.be.true
    })
  })
})
