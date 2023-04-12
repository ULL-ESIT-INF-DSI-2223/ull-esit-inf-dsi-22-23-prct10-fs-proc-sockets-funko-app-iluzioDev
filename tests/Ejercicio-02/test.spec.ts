import 'mocha'
import { expect } from 'chai'

import { PipeReader } from '../../src/Ejercicio-02/PipeReader.js'
import { HandlerReader } from '../../src/Ejercicio-02/HandlerReader.js'

describe('PipeReader class tests', () => {
  const read = new PipeReader('.gitignore')
  it('read should be an instance of PipeReader', () => {
    expect(read).to.be.an.instanceOf(PipeReader)
  })
  it('read should return 7 lines', () => {
    read.lines((l) => {
      expect(l).to.be.equal(7)
    })
  })
  it('read should return 7 words', () => {
    read.words((w) => {
      expect(w).to.be.equal(7)
    })
  })
  it('read should return 78 characters', () => {
    read.characters((c) => {
      expect(c).to.be.equal(78)
    })
  })
  it('read should return undefined if there is an error', () => {
    const read = new PipeReader('file.txt')
    read.lines((l) => {
      expect(l).to.be.equal(undefined)
    })
    read.words((w) => {
      expect(w).to.be.equal(undefined)
    })
    read.characters((c) => {
      expect(c).to.be.equal(undefined)
    })
  })
})

describe('HandlerReader class tests', () => {
  const read = new HandlerReader('.gitignore')
  it('read should be an instance of HandlerReader', () => {
    expect(read).to.be.an.instanceOf(HandlerReader)
  })
  it('read should return 7 lines', () => {
    read.lines((l) => {
      expect(l).to.be.equal(7)
    })
  })
  it('read should return 7 words', () => {
    read.words((w) => {
      expect(w).to.be.equal(7)
    })
  })
  it('read should return 78 characters', () => {
    read.characters((c) => {
      expect(c).to.be.equal(78)
    })
  })
  it('read should return undefined if there is an error', () => {
    const read = new HandlerReader('file.txt')
    read.lines((l) => {
      expect(l).to.be.equal(undefined)
    })
    read.words((w) => {
      expect(w).to.be.equal(undefined)
    })
    read.characters((c) => {
      expect(c).to.be.equal(undefined)
    })
  })
})
