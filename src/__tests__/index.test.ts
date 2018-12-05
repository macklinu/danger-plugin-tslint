import * as path from 'path'

import tslint from '../'

// tslint:disable:no-string-literal

beforeEach(() => {
  global['fail'] = jest.fn()
  global['message'] = jest.fn()
  global['warn'] = jest.fn()
})

describe('default results handler', () => {
  test('handles successful results', () => {
    tslint({
      lintResultsJsonPath: path.resolve(__dirname, '__fixtures__', 'success-results.json'),
    })
    expect(global['message']).toHaveBeenCalled()
  })
  test('handles lint failures', () => {
    tslint({
      lintResultsJsonPath: path.resolve(__dirname, '__fixtures__', 'failure-results.json'),
    })
    expect(global['fail']).toHaveBeenCalled()
  })
  test('warns when cannot find results', () => {
    tslint({
      lintResultsJsonPath: path.resolve(__dirname, '__fixtures__', 'missing-file.json'),
    })
    expect(global['warn']).toHaveBeenCalled()
  })
})

test('throws when config is not supplied', () => {
  expect(() => tslint()).toThrowErrorMatchingSnapshot()
})

test('throws when lintResultsJsonPath is not supplied', () => {
  expect(() => tslint({})).toThrowErrorMatchingSnapshot()
})

test('throws when lintResultsJson is null', () => {
  expect(() => tslint({
    lintResultsJson: null,
  })).toThrowErrorMatchingSnapshot()
})

test('throws when both lintResultsJsonPath and lintResultsJson are supplied', () => {
  const lintResultsJson = [{
    endPosition: {
      character: 1,
      line: 1,
      position: 1,
    },
    failure: 'foo',
    name: 'bar',
    ruleName: 'foo',
    ruleSeverity: 'foo',
    startPosition: {
      character: 1,
      line: 1,
      position: 1,
    },
  }]

  expect(() => tslint({
    lintResultsJson,
    lintResultsJsonPath: '/foo/bar/baz',
  })).toThrowErrorMatchingSnapshot()
})
