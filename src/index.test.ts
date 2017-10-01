import test, { AssertContext } from 'ava'
import * as mockRequire from 'mock-require'
import { spy } from 'simple-spy'

import { parse as subject } from '.'

const mockTypeScriptParserOutput = Symbol('mock-typescript-parser-output')
const mockTypeScriptParser = { parse: () => mockTypeScriptParserOutput }
mockRequire('mock-typescript-parser', mockTypeScriptParser)
const mockJavaScriptParserOutput = Symbol('mock-javascript-parser-output')
const mockJavaScriptParser = { parse: () => mockJavaScriptParserOutput }
mockRequire('mock-javascript-parser', mockJavaScriptParser)

const usesCorrectParserMacro = (t: AssertContext, options: any, expected: symbol) => {
  const actual = subject('', options)
  t.is(actual, expected)
}

test(
  'Uses correct parser #1',
  usesCorrectParserMacro,
  {
    filePath: '/foo/bar.js',
    parsers: [
      {
        test: '.*\\.js$',
        path: 'mock-javascript-parser'
      },
      {
        test: '.*\\.ts$',
        path: 'mock-typescript-parser'
      }
    ]
  },
  mockJavaScriptParserOutput
)

test(
  'Uses correct parser #2',
  usesCorrectParserMacro,
  {
    filePath: '/foo/bar.ts',
    parsers: [
      {
        test: '.*\\.js$',
        path: 'mock-javascript-parser'
      },
      {
        test: '.*\\.ts$',
        path: 'mock-typescript-parser'
      }
    ]
  },
  mockTypeScriptParserOutput
)

test('Correct parser is called once', t => {
  const code = 'Rick'
  const options = {
    filePath: 'foo.js',
    parsers: [
      {
        test: 'foo.js',
        path: 'spy-parser'
      }
    ]
  }
  const spyParser = spy(() => {})
  mockRequire('spy-parser', { parse: spyParser })
  subject(code, options)
  mockRequire.stop('spy-parser')
  t.is(spyParser.callCount, 1)
})

test('Other parsers not imported', t => {
  const code = 'Rick'
  const options = {
    filePath: 'foo.js',
    parsers: [
      {
        test: 'foo.js',
        path: 'spy-parser'
      },
      {
        test: 'bar.js',
        path: 'none-existent-package-blhashdf'
      }
    ]
  }
  mockRequire('spy-parser', { parse: () => {} })
  subject(code, options)
  t.pass('requiring a non-existent package would have been an error')
  mockRequire.stop('spy-parser')
})

test('Passes `code` on as first argument to parser', t => {
  const code = 'Rick'
  const options = {
    filePath: 'foo.js',
    parsers: [
      {
        test: 'foo.js',
        path: 'spy-parser',
        options: {
          a: 'A',
          b: 'B'
        }
      }
    ]
  }
  const spyParserRerturn = Symbol('spy-parser-return')
  const spyParser = spy(() => spyParserRerturn)
  mockRequire('spy-parser', { parse: spyParser })
  subject(code, options)
  mockRequire.stop('spy-parser')
  t.is(spyParser.args[0][0], code)
})

test('Passed parser `options`', t => {
  const options = {
    filePath: 'foo.js',
    parsers: [
      {
        test: 'foo.js',
        path: 'spy-parser',
        options: {
          a: 'A',
          b: 'B'
        }
      }
    ]
  }
  const spyParser = spy(() => {})
  mockRequire('spy-parser', { parse: spyParser })
  subject('', options)
  mockRequire.stop('spy-parser')
  const expectedPassedOptions = {
    filePath: 'foo.js',
    a: 'A',
    b: 'B'
  }
  t.deepEqual(spyParser.args[0][1], expectedPassedOptions)
})
