'use strict'

const expect = require('chai').expect
const File = require('../../src/file/file').File

describe('File specs', () => {
  it('is an object', () => {
    expect(File).to.be.an('object')
  })

  describe('.read', () => {
    it('reads the content of an existing file', () => {
      return File.read(__filename)
        .then(contents => {
          expect(contents).to.match(/const expect/) // first line of this file
        })
    })

    it('rejects the promise if the file doesnt exist', (done) => {
      File.read('/tmp/kittens.txt')
        .catch(err => {
          expect(err).to.be.ok
          done()
        })
    })
  })

  describe('.ls', () => {
    it('lists all files in a directory', () => {
      return File.ls(__dirname)
        .then(files => {
          expect(files.length).to.be.at.least(1) // at least this file
        })
    })

    it('rejects the promise if the directory doesnt exist', (done) => {
      File.ls('/tmp/kittens/')
        .catch(err => {
          expect(err).to.be.ok
          done()
        })
    })
  })

  describe('.walk', () => {
    it('lists files recursively in the directory', () => {
      let testsDir = require('path').resolve(__dirname + '/../')
      return File.walk(testsDir).then(files => {
        expect(files).to.include(__filename)
      })
    })
  })
})
