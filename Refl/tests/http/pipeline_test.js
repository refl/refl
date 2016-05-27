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
      let step1 = sinon.spy(conn => { return Promise.resolve(conn) })
      let step2 = sinon.spy(conn => { return Promise.resolve(conn) })
      let pipeline = new Pipeline("sample", [step1, step2])
      return pipeline.invoke("proko")
        .then(res => {
          expect(res).to.eq("proko")
          expect(step1.called).to.be.true
          expect(step2.called).to.be.true
        })
    })

    it('calls the pipeline step with the `invoke` argument', () => {
      let step1 = conn => {
        expect(conn).to.eql("my connection")
      }
      let pipeline = new Pipeline("sample", [step1])
      return pipeline.invoke("my connection")
    })

    it('calls the next step with the result from the previous', () => {
      let step1 = arg => { return Promise.resolve(arg + 'bar') }
      let step2 = arg => { return Promise.resolve(arg + 'qux') }
      let pipeline = new Pipeline("sample", [step1, step2])
      return pipeline.invoke("foo")
      .then(arg => {
        expect(arg).to.eq('foobarqux')
      })
    })

    it('calls the given callback with the result from the last step', () => {
      let step1 = arg => { return Promise.resolve(arg + "bar") }
      let pipeline = new Pipeline("sample", [step1])
      return pipeline.invoke("foo")
        .then(arg => {
          expect(arg).to.eq("foobar")
        })
    })

    it('calls the callback directly if the pipeline has no steps', () => {
      let pipeline = new Pipeline("sample", [])
      return pipeline.invoke("foo")
        .then(arg => {
          expect(arg).to.eq("foo")
        })
    })

    it('rejects the promise if a step rejects', () => {
      let step1 = conn => { return Promise.reject("nope") }
      let pipeline = new Pipeline("sample", [step1])
      return pipeline.invoke()
        .catch(err => {
          expect(err).to.match(/nope/)
        })
    })

    it('doesnt call the next step if a step rejects', () => {
      let step1 = sinon.spy(conn => { return Promise.reject('nope') })
      let step2 = sinon.spy(conn => { return conn })
      let pipeline = new Pipeline("sample", [step1, step2])
      return pipeline.invoke()
        .catch(err => {
          expect(step1.called).to.be.true
          expect(step2.called).to.be.false
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
      return wrapped()
        .then(arg => {
          expect(handler.called).to.be.true
        })
    })
    
    it('calls the pipeline in order before the handler', () => {
      let step1   = arg => { return Promise.resolve(arg + 2) }
      let step2   = arg => { return Promise.resolve(arg * 3) }
      let handler = arg => { return Promise.resolve(arg + 1) }
      let pipeline = new Pipeline("sample", [step1, step2])
      let wrapped = Pipeline.wrap([pipeline], handler)
      return wrapped(1)
        .then(arg => {
          expect(arg).to.eq(10) // 1 + 2, 3 * 3, 9 + 1 => 10
        })
    })

    it('calls the pipeline in the same order in the array', () => {
      let step1 = arg => { return Promise.resolve(arg + 2) }
      let step2 = arg => { return Promise.resolve(arg * 3) }
      let handler = arg => { return Promise.resolve(arg) }
      let pipeline1 = new Pipeline("sample", [step1])
      let pipeline2 = new Pipeline("other", [step2])
      let wrapped = Pipeline.wrap([pipeline1, pipeline2], handler)
      wrapped(1)
        .then(arg => {
          expect(step1.called).to.be.true
          expect(step2.called).to.be.true
          expect(handler.called).to.be.true
          expect(arg).to.eq(9) // 1 + 2, 3 * 3
        })
    })
  })
})
