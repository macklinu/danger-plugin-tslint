import { prettyResults } from '../prettyResults'

test('it formats failures', () => {
  const failureResults = require('./__fixtures__/failure-results.json')
  expect(prettyResults(failureResults)).toMatchSnapshot()
})
